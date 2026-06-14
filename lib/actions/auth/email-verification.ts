"use server"

import { sendVerificationEmail } from "@/lib/verification-email"
import crypto from "crypto"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { prisma } from "@/lib/prisma"
import { EmailVerification, ErrorResponse } from "@/interfaces"
import handleError from "@/lib/handlers/error"
import verifyUser from "@/lib/actions/studio/users/verify-user"

// Mock database for demonstration - in production, use MongoDB/Prisma
// const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function EmailVerificationAction(email: string) {
  try {
    const code = crypto.randomInt(100000, 999999).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

    const generateCode = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: new Date(expires),
        type: EmailVerification.REGISTRATION
      }
    })

    if (!generateCode) {
      return handleError(new Error("Failed to generate verification code"))
    }

    const siteName = await getSettingsValue("general_settings", "site_name")
    await sendVerificationEmail(siteName, email, code)

    return { success: true, message: "Verification code sent to your email." }
  } catch (error) {
    console.error("Email error:", error)
    return { success: false, message: "Failed to send verification email." }
  }
}

export async function verifyCode(
  email: string,
  inputCode: string
): Promise<{ success: boolean; message: string } | ErrorResponse> {
  const storedCode = await prisma.verificationToken.findUnique({
    where: { token: inputCode, identifier: email }
  })

  if (storedCode && storedCode.expires > new Date()) {
    const responseMarkVerified = await verifyUser(email, true)

    if (!responseMarkVerified.success) {
      return { success: false, message: "Cannot verify user due to an error." }
    }

    const deleteCode = await prisma.verificationToken.delete({
      where: { token: inputCode, identifier: email }
    })

    if (!deleteCode) {
      return handleError(new Error("Failed to delete verification code"))
    }
  }

  return { success: true, message: "User verified successfully." }
}
