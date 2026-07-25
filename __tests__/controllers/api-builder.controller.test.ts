import { apiBuilderController } from "@/controllers/api-builder.controller"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("apiBuilderController", () => {
  const mockPrismaEntryFindMany = prisma.entry.findMany as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("fetchData", () => {
    it("should fetch all entries when routeType is index", async () => {
      const controller = new apiBuilderController("index", "entries")
      const mockData = [{ id: "1", name: "Entry 1" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData()

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalled()
    })

    it("should fetch entry by single-param Equals", async () => {
      const controller = new apiBuilderController("single-param", "entries", "slug", "test-slug")
      const mockData = [{ id: "1", slug: "test-slug" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData("Equals")

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: { slug: "test-slug" }
      })
    })

    it("should fetch entry by single-param StartsWith", async () => {
      const controller = new apiBuilderController("single-param", "entries", "slug", "test")
      const mockData = [{ id: "1", slug: "test-slug" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData("StartsWith")

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          slug: {
            startsWith: "test"
          }
        }
      })
    })

    it("should fetch entry by single-param EndsWith", async () => {
      const controller = new apiBuilderController("single-param", "entries", "slug", "slug")
      const mockData = [{ id: "1", slug: "test-slug" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData("EndsWith")

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          slug: {
            endsWith: "slug"
          }
        }
      })
    })

    it("should fetch entry by single-param Contains", async () => {
      const controller = new apiBuilderController("single-param", "entries", "slug", "est-slu")
      const mockData = [{ id: "1", slug: "test-slug" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData("Contains")

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: {
          slug: {
            contains: "est-slu"
          }
        }
      })
    })

    it("should fetch entry by _id", async () => {
      const controller = new apiBuilderController("single-param", "entries", "_id", "mock-id")
      const mockData = [{ id: "mock-id", name: "Entry 1" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData()

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: { id: "mock-id" }
      })
    })

    it("should fetch entry by multi-param namespace", async () => {
      const controller = new apiBuilderController("multi-param", "entries", "namespace", ["a", "b", "c"])
      const mockData = [{ id: "1", namespace: "a.b.c" }]
      mockPrismaEntryFindMany.mockResolvedValue(mockData)

      const result = await controller.fetchData("Equals")

      expect(result).toEqual(mockData)
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: { namespace: "a.b.c" }
      })
    })

    it("should return error for unexpected route type", async () => {
      const controller = new apiBuilderController("invalid", "entries")
      const result = await controller.fetchData()

      expect(result).toEqual([{ message: "Error: Unexpected route type!" }])
    })

    it("should return error when database operation fails", async () => {
      const controller = new apiBuilderController("index", "entries")
      mockPrismaEntryFindMany.mockRejectedValue(new Error("DB Error"))

      const result = await controller.fetchData()

      expect(result).toEqual([{ message: "Database operation failed." }])
    })
  })
})
