import createPermissionGroup from "@/lib/actions/studio/permission-groups/create-permission-group"
import { prisma } from "@/lib/prisma"
import { getPermissionGroup } from "@/lib/auth/get-session"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/auth/get-session", () => require("@/lib/__mocks__/get-session"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("createPermissionGroup", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockPrismaCreate = prisma.permissionGroup.create as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create a permission group using prisma", async () => {
    mockGetPermissionGroup.mockResolvedValue("admin")
    const formValues = {
      name: "Editor",
      privileges: {
        editor: {
          system: { entry_types: { read: true, create: false, update: false, delete: false } },
          namespaces: {}
        }
      }
    }
    const mockCreatedGroup = { id: "1", ...formValues, slug: "editor" }
    mockPrismaCreate.mockResolvedValue(mockCreatedGroup)

    const result = await createPermissionGroup(formValues)

    expect(prisma.permissionGroup.create).toHaveBeenCalled()
    expect(result.success).toBe(true)
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await createPermissionGroup({ name: "Editor", privileges: {} })

    expect(result.success).toBe(false)
  })
})
