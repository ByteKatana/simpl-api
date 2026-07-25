"use server"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import { SettingsSchema } from "@/interfaces/settings"

export default async function getSettingsByName(name: string): Promise<ActionResponse<SettingsSchema>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to get settings"), "server")
    }

    const data = await prisma.settings.findFirstOrThrow({
      where: { name }
    })

    if (data === null || data.name !== name) {
      const unhandledError = new Error("Failed to get settings")
      return handleError(unhandledError, "server")
    }

    return { success: true, status: 200, data } as SuccessResponse<SettingsSchema>
  } catch (error) {
    return handleError(error, "server")
  }
}
