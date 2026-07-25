import updatePermissionGroups from "@/lib/actions/studio/permission-groups/update-permission-groups"
import { prisma } from "@/lib/prisma"
import { getPermissionGroup } from "@/lib/auth/get-session"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/auth/get-session", () => require("@/lib/__mocks__/get-session"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("updatePermissionGroups", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockPrismaUpdateMany = prisma.permissionGroup.updateMany as jest.Mock
  const mockPrismaTransaction = prisma.$transaction as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should update multiple permission groups using prisma transaction", async () => {
    mockGetPermissionGroup.mockResolvedValue("admin")
    const formValues = {
      privileges: {
        admin: { system: { entry_types: { read: true } }, namespaces: {} },
        editor: { system: { entry_types: { read: true } }, namespaces: {} }
      }
    }
    mockPrismaUpdateMany.mockReturnValue("mock-promise")
    mockPrismaTransaction.mockResolvedValue([{ count: 1 }, { count: 1 }])

    const result = await updatePermissionGroups(formValues)

    expect(mockPrismaTransaction).toHaveBeenCalled()
    expect(result.success).toBe(true)
    expect(result.data.modifiedCount).toBe(2)
  })

  it("should return early if no changes", async () => {
    mockGetPermissionGroup.mockResolvedValue("admin")
    const formValues = {
      privileges: {}
    }

    const result = await updatePermissionGroups(formValues)

    expect(result.success).toBe(true)
    expect(mockPrismaTransaction).not.toHaveBeenCalled()
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await updatePermissionGroups({ privileges: {} })

    expect(result.success).toBe(false)
  })
})
