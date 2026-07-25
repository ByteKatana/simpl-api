import updateIdentitySettings from "@/lib/actions/studio/settings/update-identity-setttings"
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

describe("updateIdentitySettings", () => {
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

  it("should update identity settings successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockResponse = { id: "1", name: "identity_settings", settings: { open_registration: true } }
    mockPrismaSettingsUpdate.mockResolvedValue(mockResponse)

    const result = await updateIdentitySettings({ open_registration: true }, "1")

    expect(result.success).toBe(true)
    expect(prisma.settings.update).toHaveBeenCalledWith({
      where: { id: "1", name: "identity_settings" },
      data: expect.objectContaining({ settings: { open_registration: true } })
    })
    if (result.success) {
      expect(result.data.settings).toEqual({ open_registration: true })
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await updateIdentitySettings({}, "1")

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
