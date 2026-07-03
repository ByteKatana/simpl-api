"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { EntryType } from "@/interfaces/entry_type"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function getEntryTypeById(id: string) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch entry type by id"))
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/entry-type/id/${id}?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryType = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry type by id")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryType } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
