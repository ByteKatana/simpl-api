import getPermissionGroupById from "@/lib/actions/studio/permission-groups/get-permission-group-by-id"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("getPermissionGroupById", () => {
  const mockPrismaFindUnique = prisma.permissionGroup.findUnique as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should fetch a permission group by id using prisma", async () => {
    const mockGroup = { id: "1", name: "Admin", slug: "admin", privileges: {} }
    mockPrismaFindUnique.mockResolvedValue(mockGroup)

    const result = await getPermissionGroupById("1")

    expect(mockPrismaFindUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    })
    expect(result.success).toBe(true)
    if (result.success) {
        expect(result.data).toEqual({ ...mockGroup, _id: mockGroup.id })
    }
  })

  it("should return error if not found", async () => {
    mockPrismaFindUnique.mockResolvedValue(null)

    const result = await getPermissionGroupById("non-existent")

    expect(result.success).toBe(false)
  })
})
