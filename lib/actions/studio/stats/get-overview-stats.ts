"use server"

import { prisma } from "@/lib/prisma"
import { connectDB } from "@/lib/mongodb"
import { MongoClient } from "mongodb"
import handleError from "@/lib/handlers/error"
import { ActionResponse } from "@/interfaces"
export type OverviewStats = {
  totalRequests: number
  totalEntries: number
  totalEntryTypes: number
  totalActiveUsers: number
  requestChangeMonthly: number
  userChangeSinceLastMonth: number
  entriesCreatedLastMonth: number
  hourlyData: { name: string; total: number }[]
  recentRequests: {
    endpoint: string
    apiKey: string
    responseTime: number
    timestamp: Date
  }[]
}

export default async function getOverviewStats(): Promise<ActionResponse<OverviewStats>> {
  let client: MongoClient | null = null
  try {
    client = await connectDB()
    const db = client.db(process.env.DB_NAME)

    const totalRequests = await prisma.apiRequestLog.count()
    const totalEntries = await db.collection("entries").countDocuments()
    const totalEntryTypes = await db.collection("entry_types").countDocuments()
    const totalActiveUsers = await db.collection("users").countDocuments({ status: "active" })

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    //entry change monthly
    // 1. Calculate Monthly Entry Change
    // Count entries created in the last month
    const entriesCreatedLastMonth = await db
      .collection("entries")
      .countDocuments({ created_at: { $gte: oneMonthAgo.toISOString() } })

    //request change monthly
    const requestChangeMonthly = await prisma.apiRequestLog.count({
      where: {
        timestamp: {
          gt: oneMonthAgo
        }
      }
    })

    const activeLastMonth = await db
      .collection("users")
      .countDocuments({ status: "active", createdAt: { $gte: oneMonthAgo } })
    const userChangeSinceLastMonth = totalActiveUsers - activeLastMonth

    const last24Hrs = new Date()
    last24Hrs.setHours(last24Hrs.getHours() - 24)
    const hourlyLogs = await prisma.apiRequestLog.aggregateRaw({
      pipeline: [
        { $match: { timestamp: { $gt: { $date: last24Hrs.toISOString() } } } },
        { $group: { _id: { $hour: "$timestamp" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]
    })

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const log = (hourlyLogs as unknown as any[]).find((l) => l._id === i)
      return { name: `${i}:00`, total: log ? log.count : 0 }
    })

    let recentRequests: any[] = []
    try {
      recentRequests = await prisma.apiRequestLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 10
      })
    } catch (err) {
      console.error("Prisma fetch error:", err)
      recentRequests = [] // Fallback to empty array
    }

    const formattedRecentRequests = recentRequests.map((req: any) => ({
      endpoint: req.endpoint,
      apiKey: req.apiKey ? req.apiKey.substring(0, 10) : "N/A",
      responseTime: req.responseTime,
      timestamp: req.timestamp
    }))

    return {
      success: true,
      status: 200,
      data: {
        totalRequests,
        totalEntries,
        totalEntryTypes,
        totalActiveUsers,
        requestChangeMonthly,
        userChangeSinceLastMonth,
        entriesCreatedLastMonth,
        hourlyData,
        recentRequests: formattedRecentRequests
      }
    }
  } catch (e) {
    return handleError(new Error("Failed to fetch overview stats:"), "server")
  }
}
