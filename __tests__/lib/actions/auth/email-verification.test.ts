import { EmailVerificationAction, verifyCode } from "@/lib/actions/auth/email-verification"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/verification-email"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import verifyUser from "@/lib/actions/studio/users/verify-user"
import { EmailVerification } from "@/interfaces"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

jest.mock("@/lib/verification-email", () => ({
  sendVerificationEmail: jest.fn()
}))

jest.mock("@/lib/actions/studio/settings/get-settings-value", () => ({
  getSettingsValue: jest.fn()
}))

jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn((err) => ({
    success: false,
    status: 500,
    error: { message: err.message }
  }))
}))

jest.mock("@/lib/actions/studio/users/verify-user", () => ({
  __esModule: true,
  default: jest.fn()
}))

describe("email-verification.ts", () => {
  const mockSendVerificationEmail = sendVerificationEmail as jest.Mock
  const mockGetSettingsValue = getSettingsValue as jest.Mock
  const mockVerifyUser = verifyUser as jest.Mock
  const mockPrismaVerificationTokenCreate = prisma.verificationToken.create as jest.Mock
  const mockPrismaVerificationTokenDelete = prisma.verificationToken.delete as jest.Mock
  const mockPrismaVerificationTokenFindUnique = prisma.verificationToken.findUnique as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("EmailVerificationAction", () => {
    it("should generate and send a verification code", async () => {
      const email = "test@example.com"
      const siteName = "Test Site"

      mockPrismaVerificationTokenCreate.mockResolvedValue({ id: "1" })
      mockGetSettingsValue.mockResolvedValue(siteName)
      mockSendVerificationEmail.mockResolvedValue(undefined)

      const result = await EmailVerificationAction(email)

      expect(result).toEqual({
        success: true,
        status: 200,
        data: "Verification code sent to your email."
      })
      expect(prisma.verificationToken.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          identifier: email,
          type: EmailVerification.REGISTRATION
        })
      }))
      expect(mockSendVerificationEmail).toHaveBeenCalledWith(siteName, email, expect.any(String))
    })

    it("should return error if token creation fails", async () => {
      mockPrismaVerificationTokenCreate.mockResolvedValue(null)

      const result = await EmailVerificationAction("test@example.com")

      expect(result.success).toBe(false)
      expect(result.error?.message).toBe("Failed to generate verification code")
    })
  })

  describe("verifyCode", () => {
    it("should verify code and mark user as verified", async () => {
      const email = "test@example.com"
      const code = "123456"
      const mockToken = {
        identifier: email,
        token: code,
        expires: new Date(Date.now() + 10000)
      }

      mockPrismaVerificationTokenFindUnique.mockResolvedValue(mockToken)
      mockVerifyUser.mockResolvedValue({ success: true })
      mockPrismaVerificationTokenDelete.mockResolvedValue({ id: "1" })

      const result = await verifyCode(email, code)

      expect(result).toEqual({
        success: true,
        status: 200,
        data: "User verified successfully."
      })
      expect(mockVerifyUser).toHaveBeenCalledWith(email, true)
      expect(prisma.verificationToken.delete).toHaveBeenCalledWith({
        where: { token: code, identifier: email }
      })
    })

    it("should return error for invalid or expired code", async () => {
      mockPrismaVerificationTokenFindUnique.mockResolvedValue(null)

      const result = await verifyCode("test@example.com", "wrong")

      expect(result).toEqual({
        success: false,
        status: 400,
        error: { message: "Invalid or expired verification code." }
      })
    })

    it("should return error if verifyUser fails", async () => {
      const mockToken = {
        identifier: "test@example.com",
        token: "123456",
        expires: new Date(Date.now() + 10000)
      }

      mockPrismaVerificationTokenFindUnique.mockResolvedValue(mockToken)
      mockVerifyUser.mockResolvedValue({ success: false })

      const result = await verifyCode("test@example.com", "123456")

      expect(result).toEqual({
        success: false,
        status: 500,
        error: { message: "Cannot verify user due to an error." }
      })
    })

    it("should handle unexpected errors in verifyCode", async () => {
      mockPrismaVerificationTokenFindUnique.mockRejectedValue(new Error("DB Error"))

      const result = await verifyCode("test@example.com", "123456")

      expect(result.success).toBe(false)
      expect(result.error?.message).toBe("DB Error")
    })
  })
})
