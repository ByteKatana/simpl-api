import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("getSettingsValue", () => {
  const mockPrismaFindFirst = prisma.settings.findFirst as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return settings value when found", async () => {
    mockPrismaFindFirst.mockResolvedValue({
      settings: { rate_limits: { enabled: true } }
    })
    const result = await getSettingsValue("api_settings", "rate_limits")
    expect(result).toEqual({ enabled: true })
    expect(prisma.settings.findFirst).toHaveBeenCalledWith({
      where: { name: "api_settings" }
    })
  })

  it("should return null if no record found", async () => {
    mockPrismaFindFirst.mockResolvedValue(null)
    const result = await getSettingsValue("api_settings", "rate_limits")
    expect(result).toBe(null)
  })

  it("should throw error on prisma failure", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {})
    mockPrismaFindFirst.mockRejectedValue(new Error("DB Error"))
    await expect(getSettingsValue("api_settings", "key")).rejects.toThrow("Could not retrieve settings")
  })
})
