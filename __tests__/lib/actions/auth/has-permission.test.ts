import { hasPermission } from "@/lib/actions/auth/has-permission"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/auth", () => ({
  auth: jest.fn()
}))

jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("has-permission.ts", () => {
  const mockAuth = auth as jest.Mock
  const mockPrismaPermissionGroupFindFirst = prisma.permissionGroup.findFirst as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return true if user has permission", async () => {
    mockAuth.mockResolvedValue({
      user: { permission_group: "admin" }
    })

    mockPrismaPermissionGroupFindFirst.mockResolvedValue({
      slug: "admin",
      privileges: [
        {
          "system.users": {
            permissions: ["read", "update"]
          }
        }
      ]
    })

    const result = await hasPermission("system.users.read")
    expect(result).toBe(true)
    expect(mockPrismaPermissionGroupFindFirst).toHaveBeenCalledWith({
      where: { slug: "admin" }
    })
  })

  it("should return false if user does not have permission", async () => {
    mockAuth.mockResolvedValue({
      user: { permission_group: "viewer" }
    })

    mockPrismaPermissionGroupFindFirst.mockResolvedValue({
      slug: "viewer",
      privileges: [
        {
          "system.users": {
            permissions: ["read"]
          }
        }
      ]
    })

    const result = await hasPermission("system.users.update")
    expect(result).toBe(false)
  })

  it("should return false if no session", async () => {
    mockAuth.mockResolvedValue(null)
    const result = await hasPermission("system.users.read")
    expect(result).toBe(false)
  })

  it("should return false if group not found", async () => {
    mockAuth.mockResolvedValue({
      user: { permission_group: "non-existent" }
    })
    mockPrismaPermissionGroupFindFirst.mockResolvedValue(null)

    const result = await hasPermission("system.users.read")
    expect(result).toBe(false)
  })
})
