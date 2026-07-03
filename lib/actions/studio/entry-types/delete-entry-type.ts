"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces/"
import { EntryType } from "@/interfaces/entry_type"
import { revalidatePath } from "next/cache"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function deleteEntryTypeAction(namespace: string): Promise<ActionResponse<EntryType>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to delete entry type"), "server")
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry-type/delete/${namespace}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "DELETE",
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to delete the entry type")
      return handleError(unhandledError, "server")
    }
    revalidatePath("/studio/entry-types")
    return { success: true, status: 200, data } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error, "server")
  }
}
