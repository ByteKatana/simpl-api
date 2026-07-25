import { apiKeyController } from "@/controllers/api-key.controller"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("apiKeyController", () => {
  const mockPrismaApiKeyFindMany = prisma.apiKey.findMany as jest.Mock
  const mockPrismaApiKeyCreate = prisma.apiKey.create as jest.Mock
  const mockPrismaApiKeyDeleteMany = prisma.apiKey.deleteMany as jest.Mock
  
  const mockApiKey = {
    key: "test-key",
    description: "test-description",
    permission_group: "admin",
    rate_limits: {
      time_window: 60,
      req_per_window: 100,
      time_interval: 1000
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("findKey", () => {
    it("should find an API key by key", async () => {
      const controller = new apiKeyController({ key: "test-key" })
      mockPrismaApiKeyFindMany.mockResolvedValue([mockApiKey])

      const result = await controller.findKey()

      expect(result).toEqual([mockApiKey])
      expect(prisma.apiKey.findMany).toHaveBeenCalledWith({
        where: { key: "test-key" }
      })
    })

    it("should return empty array if key not found", async () => {
      const controller = new apiKeyController({ key: "non-existent" })
      mockPrismaApiKeyFindMany.mockResolvedValue([])

      const result = await controller.findKey()

      expect(result).toEqual([])
    })
  })

  describe("create", () => {
    it("should create a new API key", async () => {
      const controller = new apiKeyController(mockApiKey)
      const mockInsertedId = "mock-id"
      mockPrismaApiKeyCreate.mockResolvedValue({ ...mockApiKey, id: mockInsertedId })

      const result = await controller.create()

      expect(result).toEqual({
        status: "success",
        message: "API Key has been generated.",
        keyId: mockInsertedId
      })
      expect(prisma.apiKey.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          key: "test-key",
          description: "test-description"
        })
      })
    })

    it("should return failed status if creation fails", async () => {
      const controller = new apiKeyController(mockApiKey)
      mockPrismaApiKeyCreate.mockResolvedValue(null)

      const result = await controller.create()

      expect(result).toEqual({
        status: "failed",
        message: "Failed to create the api key."
      })
    })
  })

  describe("delete", () => {
    it("should delete an API key by id", async () => {
      const controller = new apiKeyController({})
      const mockId = "mock-id"
      mockPrismaApiKeyDeleteMany.mockResolvedValue({ count: 1 })

      const result = await controller.delete(mockId)

      expect(result).toEqual({
        status: "success",
        message: "API Key has been removed."
      })
      expect(prisma.apiKey.deleteMany).toHaveBeenCalledWith({
        where: { id: mockId }
      })
    })

    it("should return failed status if deletion fails", async () => {
      const controller = new apiKeyController({})
      const mockId = "mock-id"
      mockPrismaApiKeyDeleteMany.mockResolvedValue({ count: 0 })

      const result = await controller.delete(mockId)

      expect(result).toEqual({
        status: "failed",
        message: "Failed to delete the api key."
      })
    })
  })
})
