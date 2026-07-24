import getAnalyticsStats from "@/lib/actions/studio/stats/get-analytics-stats"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("getAnalyticsStats", () => {
  const mockPrismaApiRequestLogFindMany = prisma.apiRequestLog.findMany as jest.Mock
  const mockPrismaApiRequestLogAggregate = prisma.apiRequestLog.aggregate as jest.Mock
  const mockPrismaApiRequestLogCount = prisma.apiRequestLog.count as jest.Mock
  const mockPrismaApiRequestLogGroupBy = prisma.apiRequestLog.groupBy as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return analytics stats successfully", async () => {
    mockPrismaApiRequestLogFindMany.mockResolvedValue([])
    mockPrismaApiRequestLogAggregate.mockResolvedValue({ _avg: { responseTime: 50 } })
    mockPrismaApiRequestLogCount.mockResolvedValue(10)
    mockPrismaApiRequestLogGroupBy.mockResolvedValue([])

    const result = await getAnalyticsStats()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeDefined()
      expect(result.data.avgResponseTime).toBe(50)
      expect(result.data.totalRequestStats.count).toBe(10)
    }
    expect(mockPrismaApiRequestLogFindMany).toHaveBeenCalled()
    expect(mockPrismaApiRequestLogAggregate).toHaveBeenCalled()
    expect(mockPrismaApiRequestLogCount).toHaveBeenCalled()
  })

  it("should return error if fetching fails", async () => {
    mockPrismaApiRequestLogFindMany.mockRejectedValue(new Error("Database error"))

    const result = await getAnalyticsStats()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.message).toContain("Failed to fetch analytics stats")
    }
  })
})
