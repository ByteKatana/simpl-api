"use server"

import { ActionResponse, SuccessResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import handleError from "@/lib/handlers/error"

type AnalyticsStats = {
  trafficData: any[]
  avgResponseTime: number
  totalRequestStats: {
    count: number
    change: number
  }
  uniqueRequestStats: {
    count: number
    change: number
  }
  rateLimitStats: {
    percentage: number
    change: number
  }
  topKeysThisWeek: { name: string; value: number }[]
  topKeysAllTime: { name: string; value: number }[]
}

export default async function getAnalyticsStats(): Promise<ActionResponse<AnalyticsStats>> {
  try {
    const now = new Date()
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - 7)
    startOfThisWeek.setHours(0, 0, 0, 0)

    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

    // 1. Traffic Overview (Day by day in a week)
    const trafficLogs = await prisma.apiRequestLog.findMany({
      where: { timestamp: { gte: startOfThisWeek } },
      select: { timestamp: true, apiKey: true }
    })

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const trafficDataMap = new Map()

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const dayName = days[d.getDay()]
      trafficDataMap.set(dayName, { name: dayName, clicks: 0, uniques: new Set() })
    }

    trafficLogs.forEach((log) => {
      const dayName = days[new Date(log.timestamp).getDay()]
      if (trafficDataMap.has(dayName)) {
        const dayData = trafficDataMap.get(dayName)
        dayData.clicks++
        dayData.uniques.add(log.apiKey)
      }
    })

    const trafficData = Array.from(trafficDataMap.values()).map((d) => ({
      name: d.name,
      clicks: d.clicks,
      uniques: d.uniques.size
    }))

    // 2. Avg. Response Time (All time)
    const avgResponse = await prisma.apiRequestLog.aggregate({
      _avg: { responseTime: true }
    })
    const avgResponseTime = Math.round(avgResponse._avg.responseTime || 0)

    // 3. Rate Limit Stats
    const thisWeekRateLimited = await prisma.apiRequestLog.count({
      where: { timestamp: { gte: startOfThisWeek }, isRateLimited: true }
    })
    const thisWeekTotal = await prisma.apiRequestLog.count({
      where: { timestamp: { gte: startOfThisWeek } }
    })
    const lastWeekRateLimited = await prisma.apiRequestLog.count({
      where: { timestamp: { gte: startOfLastWeek, lt: startOfThisWeek }, isRateLimited: true }
    })
    const lastWeekTotal = await prisma.apiRequestLog.count({
      where: { timestamp: { gte: startOfLastWeek, lt: startOfThisWeek } }
    })

    const rateLimitPercentage = thisWeekTotal > 0 ? (thisWeekRateLimited / thisWeekTotal) * 100 : 0
    const lastWeekRateLimitPercentage = lastWeekTotal > 0 ? (lastWeekRateLimited / lastWeekTotal) * 100 : 0
    const rateLimitChange = rateLimitPercentage - lastWeekRateLimitPercentage

    // 4. Unique Requests (API keys count)
    const thisWeekUniquesRaw = await prisma.apiRequestLog.groupBy({
      by: ["apiKey"],
      where: { timestamp: { gte: startOfThisWeek } },
      _count: true
    })
    const lastWeekUniquesRaw = await prisma.apiRequestLog.groupBy({
      by: ["apiKey"],
      where: { timestamp: { gte: startOfLastWeek, lt: startOfThisWeek } },
      _count: true
    })
    const uniqueRequestsThisWeek = thisWeekUniquesRaw.length
    const uniqueRequestsLastWeek = lastWeekUniquesRaw.length
    const uniqueChange =
      uniqueRequestsLastWeek > 0
        ? ((uniqueRequestsThisWeek - uniqueRequestsLastWeek) / uniqueRequestsLastWeek) * 100
        : 0

    // 5. Total Requests This Week
    const totalRequestsThisWeek = thisWeekTotal
    const totalRequestsLastWeek = lastWeekTotal
    const totalChange =
      totalRequestsLastWeek > 0 ? ((totalRequestsThisWeek - totalRequestsLastWeek) / totalRequestsLastWeek) * 100 : 0

    // 6. Top 10 API keys (This Week)
    const topKeysThisWeek = await prisma.apiRequestLog.groupBy({
      by: ["apiKey"],
      where: { timestamp: { gte: startOfThisWeek } },
      _count: { apiKey: true },
      orderBy: { _count: { apiKey: "desc" } },
      take: 10
    })

    // 7. Top 10 API keys (All Time)
    const topKeysAllTime = await prisma.apiRequestLog.groupBy({
      by: ["apiKey"],
      _count: { apiKey: true },
      orderBy: { _count: { apiKey: "desc" } },
      take: 10
    })

    return {
      success: true,
      status: 200,
      data: {
        trafficData,
        avgResponseTime,
        rateLimitStats: {
          percentage: Number(rateLimitPercentage.toFixed(1)),
          change: Number(rateLimitChange.toFixed(1))
        },
        uniqueRequestStats: { count: uniqueRequestsThisWeek, change: Number(uniqueChange.toFixed(1)) },
        totalRequestStats: { count: totalRequestsThisWeek, change: Number(totalChange.toFixed(1)) },
        topKeysThisWeek: topKeysThisWeek.map((k: any) => ({ name: k.apiKey, value: k._count.apiKey })),
        topKeysAllTime: topKeysAllTime.map((k: any) => ({ name: k.apiKey, value: k._count.apiKey }))
      }
    } as SuccessResponse<AnalyticsStats>
  } catch (e) {
    return handleError(new Error("Failed to fetch analytics stats", { cause: e }), "server")
  }
}
