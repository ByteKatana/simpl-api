import getAllSettings from "@/lib/actions/studio/settings/get-all-settings"
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

describe("getAllSettings", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockPrismaFindMany = prisma.settings.findMany as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should fetch all settings successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    const mockSettings = [{ id: "1", name: "general_settings", settings: {} }]
    mockPrismaFindMany.mockResolvedValue(mockSettings)

    const result = await getAllSettings()

    expect(result.success).toBe(true)
    expect(prisma.settings.findMany).toHaveBeenCalled()
    if (result.success) {
      expect(result.data).toEqual(mockSettings)
    }
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await getAllSettings()

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
