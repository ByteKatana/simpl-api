import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { prisma } from "@/lib/prisma"
import { getPermissionGroup } from "@/lib/auth/get-session"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/auth/get-session", () => require("@/lib/__mocks__/get-session"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("getPermissionGroups", () => {
  const mockPrismaFindMany = prisma.permissionGroup.findMany as jest.Mock
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should fetch permission groups using prisma", async () => {
    mockGetPermissionGroup.mockResolvedValue("admin")
    const mockGroups = [{ id: "1", name: "Admin", slug: "admin", privileges: {} }]
    mockPrismaFindMany.mockResolvedValue(mockGroups)

    const result = await getPermissionGroups()

    expect(mockPrismaFindMany).toHaveBeenCalled()
    expect(result.success).toBe(true)
    if (result.success) {
        expect(result.data).toEqual(mockGroups.map(group => ({ ...group, _id: group.id })))
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await getPermissionGroups()

    expect(result.success).toBe(false)
  })
})
