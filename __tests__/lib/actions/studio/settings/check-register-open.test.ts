import { checkRegisterOpen } from "@/lib/actions/studio/settings/check-register-open"
import { prisma } from "@/lib/prisma"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

describe("checkRegisterOpen", () => {
  const mockPrismaFindFirst = prisma.settings.findFirst as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return open_registration value when set", async () => {
    mockPrismaFindFirst.mockResolvedValue({
      settings: { open_registration: true }
    })
    const result = await checkRegisterOpen()
    expect(result).toBe(true)
    expect(prisma.settings.findFirst).toHaveBeenCalledWith({
      where: { name: "identity_settings" }
    })
  })

  it("should return null if no record found", async () => {
    mockPrismaFindFirst.mockResolvedValue(null)
    const result = await checkRegisterOpen()
    expect(result).toBe(null)
  })

  it("should return null if settings field is missing", async () => {
    mockPrismaFindFirst.mockResolvedValue({ settings: null })
    const result = await checkRegisterOpen()
    expect(result).toBe(null)
  })

  it("should return null if open_registration is not in settings", async () => {
    mockPrismaFindFirst.mockResolvedValue({
      settings: { other_setting: true }
    })
    const result = await checkRegisterOpen()
    expect(result).toBe(null)
  })

  it("should throw error on prisma failure", async () => {
    // Silence console.error for this test
    jest.spyOn(console, "error").mockImplementation(() => {})
    mockPrismaFindFirst.mockRejectedValue(new Error("DB Error"))
    await expect(checkRegisterOpen()).rejects.toThrow("Could not retrieve settings")
  })
})
