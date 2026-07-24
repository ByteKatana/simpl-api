import updatePermissionGroup from "@/lib/actions/studio/permission-groups/update-permission-group"
import { prisma } from "@/lib/prisma"
import { getPermissionGroup } from "@/lib/auth/get-session"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => require("@/lib/__mocks__/prisma-actions"))
jest.mock("@/lib/auth/get-session", () => require("@/lib/__mocks__/get-session"))
jest.mock("@/lib/handlers/error", () => require("@/lib/__mocks__/error"))

describe("updatePermissionGroup", () => {
  const mockPrismaUpdate = prisma.permissionGroup.update as jest.Mock
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should update a permission group using prisma", async () => {
    mockGetPermissionGroup.mockResolvedValue("admin")
    const formValues = {
      name: "Editor Updated",
      privileges: {
        editor: {
          system: { entry_types: { read: true, create: true, update: true, delete: true } },
          namespaces: {}
        }
      }
    }
    const mockUpdatedGroup = { id: "1", ...formValues, slug: "editor-updated" }
    mockPrismaUpdate.mockResolvedValue(mockUpdatedGroup)

    const result = await updatePermissionGroup(formValues, "1")

    expect(mockPrismaUpdate).toHaveBeenCalled()
    expect(result.success).toBe(true)
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await updatePermissionGroup({ name: "Editor", privileges: {} }, "1")

    expect(result.success).toBe(false)
  })
})
