import { NextApiRequest, NextApiResponse } from "next"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { logApiRequest } from "./logger"
import { getApiKeyInfo } from "@/lib/actions/studio/settings/get-api-key-info"
import { ApiKey } from "@/interfaces" // Import the logger

// In-memory store (Resets on server restart)
const rateLimitStore = new Map<
  string,
  {
    count: number
    resetTime: number
    lastRequestTime: number
  }
>()

export type NextApiHandlerWithAuth = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>

export function withRateLimit(handler: NextApiHandlerWithAuth) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now() // Start timer

    // Extract info for logging
    const endpoint = req.url || "unknown"
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "0.0.0.0"

    // Helper to log the request at the end
    const finalizeLog = (identifier: string = "UNAUTHORIZED", isRateLimited?: boolean, rateLimitType?: string) => {
      const responseTime = Date.now() - startTime
      // Fire and forget logging
      logApiRequest({
        endpoint,
        apiKey: identifier.substring(0, 10), // Log first 10 chars for privacy/storage
        responseTime,
        ipAddress,
        isRateLimited,
        rateLimitType
      })
    }

    try {
      // 1. Fetch settings
      const rateLimits = await getSettingsValue("api_settings", "rate_limits")

      // 2. Identify user
      const authHeader = req.headers.authorization?.startsWith("Bearer ")
      let bearerToken = authHeader ? req.headers.authorization!.substring(7) : null
      let identifier = (req.query.apikey as string) || bearerToken

      let identiferDetails: ApiKey | undefined
      if (identifier) {
        const responseIdentiferDetails = await getApiKeyInfo(identifier)
        identiferDetails = responseIdentiferDetails.data
      }

      if (identiferDetails && !identiferDetails.rate_limits && !rateLimits) {
        finalizeLog(identifier || "NO-LIMIT", false, "")
        return handler(req, res)
      }

      const {
        time_window = 1,
        req_per_window = 10,
        time_interval = 0
      } = (identiferDetails && identiferDetails.rate_limits) || rateLimits

      // --- SERVER ACTION BYPASS ---
      if (identifier && identifier === process.env.API_KEY) {
        //finalizeLog("SYSTEM")
        return handler(req, res)
      }

      if (!identifier) {
        finalizeLog("UNAUTHORIZED", false, "")
        return res.status(401).json({
          error: "Unauthorized",
          message: "API key or Bearer token required for API request."
        })
      }

      const now = Date.now()
      const windowMs = time_window * 60 * 1000
      const userRecord = rateLimitStore.get(identifier)

      // 3. Check Minimum Time Interval
      if (userRecord && time_interval > 0) {
        if (now - userRecord.lastRequestTime < time_interval) {
          finalizeLog(identifier, true, "TIME-INTERVAL")
          return res.status(429).json({
            error: "Too Many Requests",
            message: `Please wait ${time_interval}ms between requests.`
          })
        }
      }

      // 4. Check Window-based Limit
      if (!userRecord || now > userRecord.resetTime) {
        rateLimitStore.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
          lastRequestTime: now
        })
      } else {
        userRecord.count++
        userRecord.lastRequestTime = now

        if (userRecord.count > req_per_window) {
          res.setHeader("X-RateLimit-Limit", req_per_window.toString())
          res.setHeader("X-RateLimit-Remaining", "0")
          res.setHeader("X-RateLimit-Reset", Math.ceil(userRecord.resetTime / 1000).toString())

          finalizeLog(identifier, true, "REQ-PER-WINDOW")
          return res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again later.",
            retry_after: Math.ceil((userRecord.resetTime - now) / 1000)
          })
        }
      }

      // 5. Success - Set Headers and Proceed
      const record = rateLimitStore.get(identifier)!
      res.setHeader("X-RateLimit-Limit", req_per_window.toString())
      res.setHeader("X-RateLimit-Remaining", Math.max(0, req_per_window - record.count).toString())
      res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString())

      // Wrap the original handler to log when it finishes
      const originalEnd = res.end
      res.end = function (...args: any[]) {
        finalizeLog(identifier, false, "")
        return originalEnd.apply(this, args)
      }

      return handler(req, res)
    } catch (error) {
      console.error("Rate limit error:", error)
      finalizeLog("RATELIMIT-ERROR", false, "")
      return handler(req, res)
    }
  }
}
