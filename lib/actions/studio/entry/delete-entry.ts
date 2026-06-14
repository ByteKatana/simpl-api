"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { Entry } from "@/interfaces/entry"
import { revalidatePath } from "next/cache"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function deleteEntryAction(id: string) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to delete entry"))
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/delete/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "DELETE",
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to delete the entry")
      return handleError(unhandledError)
    }
    revalidatePath("/studio/entries")
    return { success: true, status: 200, data } as SuccessResponse<Entry[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
