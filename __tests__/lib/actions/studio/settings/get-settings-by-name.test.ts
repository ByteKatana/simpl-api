import getSettingsByName from "@/lib/actions/studio/settings/get-settings-by-name"
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

describe("getSettingsByName", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaFindFirstOrThrow = prisma.settings.findFirstOrThrow as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should fetch settings by name successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockSetting = { id: "1", name: "general_settings", settings: {} }
    mockPrismaFindFirstOrThrow.mockResolvedValue(mockSetting)

    const result = await getSettingsByName("general_settings")

    expect(result.success).toBe(true)
    expect(prisma.settings.findFirstOrThrow).toHaveBeenCalledWith({
      where: { name: "general_settings" }
    })
    if (result.success) {
      expect(result.data).toEqual(mockSetting)
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await getSettingsByName("general_settings")

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })

  it("should return error if name mismatch", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    mockPrismaFindFirstOrThrow.mockResolvedValue({ name: "other" })

    const result = await getSettingsByName("general_settings")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
      expect(result.error.message).toBe("Failed to get settings")
    }
  })
})
