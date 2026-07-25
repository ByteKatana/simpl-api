import { getApiKeyInfo } from "@/lib/actions/studio/settings/get-api-key-info"
import handleError from "@/lib/handlers/error"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("getApiKeyInfo", () => {
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaFindFirst = prisma.apiKey.findFirst as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should fetch api key info successfully", async () => {
    const mockKey = { id: "1", key: "test-key", description: "Test" }
    mockPrismaFindFirst.mockResolvedValue(mockKey)

    const result = await getApiKeyInfo("test-key")

    expect(result.success).toBe(true)
    expect(prisma.apiKey.findFirst).toHaveBeenCalledWith({
      where: { key: "test-key" }
    })
    if (result.success) {
      expect(result.data.key).toBe("test-key")
    }
  })

  it("should return error if api key not found", async () => {
    mockPrismaFindFirst.mockResolvedValue(null)

    const result = await getApiKeyInfo("invalid-key")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toBe("Invalid API key")
    }
  })
})
