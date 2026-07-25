import updateApiSettings from "@/lib/actions/studio/settings/update-api-settings"
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

describe("updateApiSettings", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaSettingsUpdate = prisma.settings.update as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should update api settings successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockResponse = { id: "1", name: "api_settings", settings: { some: "value" } }
    mockPrismaSettingsUpdate.mockResolvedValue(mockResponse)

    const result = await updateApiSettings({ some: "value" }, "1")

    expect(result.success).toBe(true)
    expect(prisma.settings.update).toHaveBeenCalledWith({
      where: { id: "1", name: "api_settings" },
      data: expect.objectContaining({ settings: { some: "value" } })
    })
    if (result.success) {
      expect(result.data.settings).toEqual({ some: "value" })
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await updateApiSettings({}, "1")

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
