import createPermissionGroup from "@/lib/actions/studio/permission-groups/create-permission-group"
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

describe("createPermissionGroup", () => {
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

  it("should create a permission group successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockData = { id: "1", name: "Test Group", slug: "test-group", privileges: {} }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockData
    })

    const formValues = { name: "Test Group", privileges: {} }
    const result = await createPermissionGroup(formValues as any)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockData)
    }
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/permission-group/create"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"name":"Test Group"')
      })
    )
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await createPermissionGroup({ name: "Test" } as any)

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

    const result = await createPermissionGroup({ name: "Test" } as any)

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Failed to create permission group")
    }
    expect(mockHandleError).toHaveBeenCalled()
  })

  it("should return error if fetch throws", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    mockFetch.mockRejectedValue(new Error("Network error"))

    const result = await createPermissionGroup({ name: "Test" } as any)

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Network error")
    }
    expect(mockHandleError).toHaveBeenCalled()
  })
})
