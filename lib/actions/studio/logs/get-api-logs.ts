"use server"

import { prisma } from "@/lib/prisma"
import handleError from "@/lib/handlers/error"

interface GetApiLogsParams {
  isRateLimited?: boolean
  rateLimitType?: string
  skip?: number
  take?: number
}

export default async function getApiLogs(params: GetApiLogsParams = {}) {
  try {
    const { isRateLimited, rateLimitType, skip = 0, take = 10 } = params

    const where: any = {}
    if (typeof isRateLimited === "boolean") {
      where.isRateLimited = isRateLimited
    }
    if (rateLimitType && rateLimitType !== "ALL") {
      where.rateLimitType = rateLimitType
    }

    const [logs, total] = await Promise.all([
      prisma.apiRequestLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take
      }),
      prisma.apiRequestLog.count({ where })
    ])

    return {
      success: true,
      data: {
        logs,
        total,
        hasMore: skip + take < total
      }
    }
  } catch (e) {
    return handleError(new Error("Failed to fetch logs", { cause: e }))
  }
}
