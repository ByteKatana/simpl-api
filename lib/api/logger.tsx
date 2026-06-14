import { prisma } from "@/lib/prisma"

interface LogData {
  endpoint: string
  apiKey: string
  responseTime: number
  ipAddress: string
  isRateLimited?: boolean
  rateLimitType?: string
}

export async function logApiRequest({
  endpoint,
  apiKey,
  responseTime,
  ipAddress,
  isRateLimited,
  rateLimitType
}: LogData) {
  try {
    await prisma.apiRequestLog.create({
      data: {
        endpoint,
        apiKey,
        responseTime,
        ipAddress,
        isRateLimited: isRateLimited || false,
        rateLimitType: rateLimitType || "",
        timestamp: new Date()
      }
    })
  } catch (error) {
    console.error("Failed to log API request:", error)
  }
}
