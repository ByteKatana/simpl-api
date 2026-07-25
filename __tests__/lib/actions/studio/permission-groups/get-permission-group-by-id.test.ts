import getPermissionGroupById from "@/lib/actions/studio/permission-groups/get-permission-group-by-id"
import handleError from "@/lib/handlers/error"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn()
}))

describe("getPermissionGroupById", () => {
  const mockHandleError = handleError as unknown as jest.Mock
  const mockFetch = jest.fn()
  global.fetch = mockFetch

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.BASE_URL = "http://localhost:3000"
    process.env.API_KEY = "test-api-key"

    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should fetch a permission group by id successfully", async () => {
    const mockGroup = { id: "1", name: "Test Group", slug: "test-group", privileges: {} }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockGroup
    })

    const result = await getPermissionGroupById("1")

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockGroup)
    }
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/permission-group/1"),
      expect.objectContaining({
        cache: "no-store"
      })
    )
  })

  it("should handle array response and return the first element", async () => {
    const mockGroup = { id: "1", name: "Test Group", slug: "test-group", privileges: {} }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [mockGroup]
    })

    const result = await getPermissionGroupById("1")

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(mockGroup)
    }
  })

  it("should return error if fetch fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not Found" })
    })

    const result = await getPermissionGroupById("1")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toContain("Failed to fetch permission group by slug")
    }
    expect(mockHandleError).toHaveBeenCalled()
  })
})
