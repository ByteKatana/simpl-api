"use server"

import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { SuccessResponse, ActionResponse } from "@/interfaces"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

/**
 * Server Action: deleteApiKey
 * Deletes an API key from database by its ID.
 */
export default async function deleteApiKey(id: string): Promise<ActionResponse<boolean>> {
  try {
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized to delete API keys"), "server")
    }

    await prisma.apiKey.delete({
      where: { id }
    })

    revalidatePath("/studio/settings")

    return {
      success: true,
      status: 200,
      data: true
    } as SuccessResponse<boolean>
  } catch (error) {
    return handleError(error, "server")
  }
}
