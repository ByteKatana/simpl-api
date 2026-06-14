"use server"

import { prisma } from "@/lib/prisma"

/**
 * Server action to check if registration opens or not.
 */
export async function checkRegisterOpen() {
  try {
    const record = await prisma.settings.findFirst({
      where: {
        name: "identity_settings"
      }
    })

    if (!record || !record.settings) {
      return null
    }

    // Since record.settings is stored as a Json object in Prisma
    const allSettings = record.settings as Record<string, any>

    // Return the specific setting requested
    return allSettings["open_registration"] || null
  } catch (error) {
    console.error("Error fetching settings:", error)
    throw new Error("Could not retrieve settings")
  }
}
