import generateApiKey from "@/lib/actions/studio/settings/generate-api-key"
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
jest.mock("uid", () => ({
  uid: jest.fn().mockReturnValue("mocked-api-key")
}))

describe("generateApiKey", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaApiKeyCreate = prisma.apiKey.create as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should generate an api key successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockCreatedKey = {
      id: "1",
      key: "mocked-api-key",
      description: "Test Key",
      permission_group: "editor",
      rate_limits: {},
      created_at: new Date()
    }
    mockPrismaApiKeyCreate.mockResolvedValue(mockCreatedKey)

    const formValues = {
      description: "Test Key",
      permission_group: "editor",
      rate_limits: {
        time_window: 1,
        req_per_window: 60,
        time_interval: 1000
      }
    }
    const result = await generateApiKey(formValues as any)

    expect(result.success).toBe(true)
    expect(prisma.apiKey.create).toHaveBeenCalled()
    if (result.success) {
      expect(result.data.key).toBe("mocked-api-key")
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await generateApiKey({} as any)

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
