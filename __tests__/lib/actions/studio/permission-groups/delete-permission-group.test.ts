import deletePermissionGroupAction from "@/lib/actions/studio/permission-groups/delete-permission-group"
import { prisma } from "@/lib/prisma"
import { getPermissionGroup } from "@/lib/auth/get-session"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/auth/get-session", () => require("@/lib/__mocks__/get-session"))
jest.mock("next/cache", () => require("@/lib/__mocks__/next-cache"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("deletePermissionGroupAction", () => {
  const mockPrismaDelete = prisma.permissionGroup.delete as jest.Mock
  const mockPrismaFindMany = prisma.permissionGroup.findMany as jest.Mock
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should delete a permission group using prisma", async () => {
    ;(getPermissionGroup as jest.Mock).mockResolvedValue("admin")
    mockPrismaDelete.mockResolvedValue({ id: "1" })
    mockPrismaFindMany.mockResolvedValue([])

    const result = await deletePermissionGroupAction("1")

    expect(mockPrismaDelete).toHaveBeenCalledWith({
      where: { id: "1" },
    })
    expect(result.success).toBe(true)
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await deletePermissionGroupAction("1")

    expect(result.success).toBe(false)
  })
})
