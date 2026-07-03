"use server"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import { SettingsSchema } from "@/interfaces/settings"

export default async function getAllSettings(): Promise<ActionResponse<SettingsSchema[]>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to get settings"), "server")
    }

    const data = await prisma.settings.findMany()

    if (data === null) {
      const unhandledError = new Error("Failed to get all settings")
      return handleError(unhandledError, "server")
    }

    return { success: true, status: 200, data } as SuccessResponse<SettingsSchema[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
