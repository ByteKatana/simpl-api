import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { getApiKeyInfo } from "@/lib/actions/studio/settings/get-api-key-info"
import { isSystemApiKey } from "@/lib/api/utils"

jest.mock("@/lib/actions/studio/permission-groups/get-permission-groups", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("@/lib/actions/studio/settings/get-api-key-info", () => ({
  getApiKeyInfo: jest.fn()
}))

jest.mock("@/lib/api/utils", () => ({
  isSystemApiKey: jest.fn()
}))

describe("has-permission-api.ts", () => {
  const mockGetPermissionGroups = getPermissionGroups as jest.Mock
  const mockGetApiKeyInfo = getApiKeyInfo as jest.Mock
  const mockIsSystemApiKey = isSystemApiKey as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return true if it is a system API key", async () => {
    mockIsSystemApiKey.mockReturnValue(true)
    const result = await hasPermissionApi({ key: "system-key" }, "system.users.create")
    expect(result).toBe(true)
  })

  it("should return true if API key has permission", async () => {
    mockIsSystemApiKey.mockReturnValue(false)
    mockGetApiKeyInfo.mockResolvedValue({
      success: true,
      data: { permission_group: "editor" }
    })
    mockGetPermissionGroups.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "editor",
          privileges: [
            {
              "articles.coding": {
                permissions: ["read", "update"]
              }
            }
          ]
        }
      ]
    })

    const result = await hasPermissionApi({ key: "editor-key" }, "articles.coding.update")
    expect(result).toBe(true)
  })

  it("should return false if API key does not have permission", async () => {
    mockIsSystemApiKey.mockReturnValue(false)
    mockGetApiKeyInfo.mockResolvedValue({
      success: true,
      data: { permission_group: "viewer" }
    })
    mockGetPermissionGroups.mockResolvedValue({
      success: true,
      data: [
        {
          slug: "viewer",
          privileges: [
            {
              "articles.coding": {
                permissions: ["read"]
              }
            }
          ]
        }
      ]
    })

    const result = await hasPermissionApi({ key: "viewer-key" }, "articles.coding.update")
    expect(result).toBe(false)
  })

  it("should return false if API key has no permission group", async () => {
    mockIsSystemApiKey.mockReturnValue(false)
    mockGetApiKeyInfo.mockResolvedValue({
      success: true,
      data: { permission_group: null }
    })

    const result = await hasPermissionApi({ key: "no-group-key" }, "system.entries.read")
    expect(result).toBe(false)
  })
})
