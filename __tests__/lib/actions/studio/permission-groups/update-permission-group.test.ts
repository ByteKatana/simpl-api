import updatePermissionGroup from "@/lib/actions/studio/permission-groups/update-permission-group"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/auth/get-session", () => ({
  getPermissionGroup: jest.fn()
}))
jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn()
}))

describe("updatePermissionGroup", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockFetch = jest.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.BASE_URL = "http://localhost:3000"
    process.env.API_KEY = "test-api-key"
    process.env.SECRET_KEY = "test-secret-key"

    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should update a permission group successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockData = { id: "1", name: "Updated Group", slug: "updated-group", privileges: {} }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData
    })

    const formValues = { name: "Updated Group", privileges: {} }
    const result = await updatePermissionGroup(formValues as any, "1")

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockData)
    }
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/permission-group/update/1"),
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining('"name":"Updated Group"')
      })
    )
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await updatePermissionGroup({ name: "Test" } as any, "1")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Unauthorized")
    }
    expect(mockHandleError).toHaveBeenCalled()
  })

  it("should return error if fetch fails", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server Error" })
    })

    const result = await updatePermissionGroup({ name: "Test" } as any, "1")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Failed to update permission group")
    }
    expect(mockHandleError).toHaveBeenCalled()
  })
})
