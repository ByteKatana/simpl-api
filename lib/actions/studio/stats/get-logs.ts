"use server"

import { prisma } from "@/lib/prisma"
import handleError from "@/lib/handlers/error"

export interface GetLogsParams {
  type?: string
  isRateLimited?: boolean
  rateLimitType?: string
  skip?: number
  take?: number
}

export default async function getLogs(params: GetLogsParams = {}) {
  try {
    const { isRateLimited, rateLimitType, skip = 0, take = 10 } = params

    const where: any = {}
    if (isRateLimited !== undefined) {
      where.isRateLimited = isRateLimited
    }
    if (rateLimitType && rateLimitType !== "ALL") {
      where.rateLimitType = rateLimitType
    }

    const logs = await prisma.apiRequestLog.findMany({
      where,
      orderBy: {
        timestamp: "desc"
      },
      skip,
      take
    })

    const total = await prisma.apiRequestLog.count({ where })

    return {
      success: true,
      data: {
        logs,
        total,
        hasMore: skip + take < total
      }
    }
  } catch (e) {
    return handleError(new Error("Failed to fetch logs", { cause: e }), "server")
  }
}
