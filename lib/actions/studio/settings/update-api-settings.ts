"use server"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"
import { ApiSettings } from "@/interfaces/settings"

export default async function updateApiSettings(formValues: any, _id: string): Promise<ActionResponse<ApiSettings>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to update settings"), "server")
    }

    const response = await prisma.settings.update({
      where: { id: _id, name: "api_settings" },
      data: {
        settings: formValues,
        updated_at: new Date().toISOString()
      }
    })

    if (response === null || response.id !== _id) {
      const unhandledError = new Error("Failed to update general settings")
      return handleError(unhandledError, "server")
    }
    const data = {
      id: response.id,
      name: response.name,
      settings: response.settings
    } as ApiSettings

    return { success: true, status: 200, data } as SuccessResponse<ApiSettings>
  } catch (error) {
    return handleError(error, "server")
  }
}
