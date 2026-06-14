"use server"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import { GeneralSettings } from "@/interfaces/settings"

export default async function updateGeneralSettings(
  formValues: any,
  _id: string
): Promise<ActionResponse<GeneralSettings>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to update settings"))
    }

    const response = await prisma.settings.update({
      where: { id: _id, name: "general_settings" },
      data: {
        settings: formValues,
        updated_at: new Date().toISOString()
      }
    })

    if (response === null || response.id !== _id) {
      const unhandledError = new Error("Failed to update general settings")
      return handleError(unhandledError)
    }
    const data = {
      id: response.id,
      name: response.name,
      settings: response.settings
    } as GeneralSettings

    return { success: true, status: 200, data } as SuccessResponse<GeneralSettings>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
