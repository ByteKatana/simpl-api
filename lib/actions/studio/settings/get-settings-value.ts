"use server"

import { prisma } from "@/lib/prisma"

/**
 * Server action to retrieve specific settings by name and key.
 *
 * @param name - The name of the settings record (e.g., "api_settings")
 * @param settingsKey - The specific key to retrieve from the settings JSON object (e.g., "rate_limits")
 * @returns The specific settings value or null if not found
 */
export async function getSettingsValue(name: string, settingsKey: string) {
  try {
    const record = await prisma.settings.findFirst({
      where: {
        name: name
      }
    })

    if (!record || !record.settings) {
      return null
    }

    // Since record.settings is stored as a Json object in Prisma
    const allSettings = record.settings as Record<string, any>

    // Return the specific setting requested
    return allSettings[settingsKey] || null
  } catch (error) {
    console.error("Error fetching settings:", error)
    throw new Error("Could not retrieve settings")
  }
}
