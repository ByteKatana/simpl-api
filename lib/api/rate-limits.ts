import { NextApiRequest, NextApiResponse } from "next"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { logApiRequest } from "./logger"
import { getApiKeyInfo } from "@/lib/actions/studio/settings/get-api-key-info"
import redis from "@/lib/redis"

export type NextApiHandlerWithAuth = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

/**
 * Higher-order function to apply rate limiting to an API handler using Redis.
 * Supports window-based request limits and minimum time intervals between requests.
 * Atomic operations are ensured via a custom Lua script registered on the Redis client.
 */
export function withRateLimit(handler: NextApiHandlerWithAuth) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now()

    // Extract info for logging
    const endpoint = req.url || "unknown"
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "0.0.0.0"

    // Helper to log the request at the end of the response lifecycle
    const finalizeLog = (identifier: string = "UNAUTHORIZED", isRateLimited?: boolean, rateLimitType?: string) => {
      const responseTime = Date.now() - startTime
      logApiRequest({
        endpoint,
        apiKey: identifier.substring(0, 10), // Log first 10 chars for privacy
        responseTime,
        ipAddress,
        isRateLimited,
        rateLimitType
      })
    }

    try {
      // 1. Identify user / API key
      const authHeader = req.headers.authorization?.startsWith("Bearer ")
      const bearerToken = authHeader ? req.headers.authorization!.substring(7) : null
      const identifier = (req.query.apikey as string) || bearerToken

      // --- SERVER ACTION / SYSTEM BYPASS ---
      // This is the only bypass allowed according to the requirements
      if (identifier && identifier === process.env.API_KEY) {
        return handler(req, res)
      }

      if (!identifier) {
        finalizeLog("UNAUTHORIZED", false, "")
        return res.status(401).json({
          error: "Unauthorized",
          message: "API key or Bearer token required for API request."
        })
      }

      // 2. Fetch settings and key details in parallel
      // Fetch global limits from the "api-settings" document as specified
      const [rateLimits, responseIdentiferDetails] = await Promise.all([
        getSettingsValue("api-settings", "rate_limits"),
        getApiKeyInfo(identifier)
      ])

      const identiferDetails = responseIdentiferDetails?.data

      // 3. Determine effective rate limits
      // Keys without specific limits follow global limits.
      // If neither is defined in the database, use safe default values.
      const {
        time_window = 1, // in minutes
        req_per_window = 10, // max requests
        time_interval = 0 // min ms between requests
      } = identiferDetails?.rate_limits || rateLimits || {}

      // 4. Atomic Rate Limiting Check via Redis Lua Script
      const now = Date.now()
      const windowMs = time_window * 60 * 1000
      const redisKey = `rate_limit:${identifier}`

      // Lua script returns: [allowed (0/1), currentCount, resetTime, retryAfter, limitType]
      const [allowed, currentCount, resetTime, retryAfter, limitType] = await redis.rateLimitAtomic(
        redisKey,
        now,
        windowMs,
        req_per_window,
        time_interval
      )

      if (allowed === 0) {
        res.setHeader("X-RateLimit-Limit", req_per_window.toString())
        res.setHeader("X-RateLimit-Remaining", "0")
        res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString())

        if (limitType === "INTERVAL") {
          finalizeLog(identifier, true, "TIME-INTERVAL")
          return res.status(429).json({
            error: "Too Many Requests",
            message: `Please wait ${time_interval}ms between requests.`
          })
        } else {
          finalizeLog(identifier, true, "REQ-PER-WINDOW")
          return res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again later.",
            retry_after: Math.ceil(retryAfter / 1000)
          })
        }
      }

      // 5. Success - Set Headers and Proceed to handler
      res.setHeader("X-RateLimit-Limit", req_per_window.toString())
      res.setHeader("X-RateLimit-Remaining", Math.max(0, req_per_window - currentCount).toString())
      res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString())

      // Wrap the original response end method to log performance and status
      const originalEnd = res.end
      res.end = function (this: any, chunk?: any, encoding?: any, cb?: any) {
        finalizeLog(identifier, false, "")
        return originalEnd.call(this, chunk, encoding, cb)
      } as any

      return handler(req, res)
    } catch (error) {
      // Fail-open strategy: allow traffic if Redis or DB is unavailable to maintain service availability
      console.error("Rate limit service error:", error)
      finalizeLog("RATELIMIT-ERROR", false, "")
      return handler(req, res)
    }
  }
}
