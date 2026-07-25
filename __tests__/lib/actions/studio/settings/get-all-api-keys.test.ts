import getAllApiKeys from "@/lib/actions/studio/settings/get-all-api-keys"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/auth/get-session", () => ({
  getPermissionGroup: jest.fn()
}))
jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("getAllApiKeys", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaFindMany = prisma.apiKey.findMany as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should fetch all api keys successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockKeys = [
      { id: "1", key: "key-1", created_at: new Date() },
      { id: "2", key: "key-2", created_at: new Date() }
    ]
    mockPrismaFindMany.mockResolvedValue(mockKeys)

    const result = await getAllApiKeys()

    expect(result.success).toBe(true)
    expect(prisma.apiKey.findMany).toHaveBeenCalledWith({
      orderBy: { created_at: "desc" }
    })
    if (result.success) {
      expect(result.data).toHaveLength(2)
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await getAllApiKeys()

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
