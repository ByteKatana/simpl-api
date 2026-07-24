import getOverviewStats from "@/lib/actions/studio/stats/get-overview-stats"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("getOverviewStats", () => {
  const mockPrismaApiRequestLogCount = prisma.apiRequestLog.count as jest.Mock
  const mockPrismaEntryCount = prisma.entry.count as jest.Mock
  const mockPrismaEntryTypeCount = prisma.entryType.count as jest.Mock
  const mockPrismaUserCount = prisma.user.count as jest.Mock
  const mockPrismaApiRequestLogAggregateRaw = prisma.apiRequestLog.aggregateRaw as jest.Mock
  const mockPrismaApiRequestLogFindMany = prisma.apiRequestLog.findMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return overview stats successfully using Prisma", async () => {
    mockPrismaApiRequestLogCount.mockResolvedValue(100)
    mockPrismaEntryCount.mockResolvedValue(50)
    mockPrismaEntryTypeCount.mockResolvedValue(5)
    mockPrismaUserCount.mockResolvedValue(10)
    mockPrismaApiRequestLogAggregateRaw.mockResolvedValue([])
    mockPrismaApiRequestLogFindMany.mockResolvedValue([])

    const result = await getOverviewStats()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.totalRequests).toBe(100)
      expect(result.data.totalEntries).toBe(50)
      expect(result.data.totalEntryTypes).toBe(5)
      expect(result.data.totalActiveUsers).toBe(10)
    }
  })

  it("should return an error if Prisma throws an error", async () => {
    mockPrismaApiRequestLogCount.mockRejectedValue(new Error("Failed to fetch overview stats:"))

    const result = await getOverviewStats()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toStrictEqual({"message": "Failed to fetch overview stats:"})
    }
  })

})
