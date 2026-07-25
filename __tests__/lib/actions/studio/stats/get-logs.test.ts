import getLogs from "@/lib/actions/studio/stats/get-logs"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("getLogs", () => {
  const mockPrismaApiRequestLogFindMany = prisma.apiRequestLog.findMany as jest.Mock
  const mockPrismaApiRequestLogCount = prisma.apiRequestLog.count as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return logs successfully", async () => {
    const mockLogs = [{ id: "1", endpoint: "/api/test", timestamp: new Date() }]
    mockPrismaApiRequestLogFindMany.mockResolvedValue(mockLogs)
    mockPrismaApiRequestLogCount.mockResolvedValue(1)

    const result = await getLogs({ take: 10, skip: 0 })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.logs).toEqual(mockLogs)
      expect(result.data.total).toBe(1)
      expect(result.data.hasMore).toBe(false)
    }
    expect(mockPrismaApiRequestLogFindMany).toHaveBeenCalledWith(expect.objectContaining({
      take: 10,
      skip: 0
    }))
  })

  it("should return error if fetching fails", async () => {
    mockPrismaApiRequestLogFindMany.mockRejectedValue(new Error("Database error"))

    const result = await getLogs()

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Failed to fetch logs")
    }
  })
})
