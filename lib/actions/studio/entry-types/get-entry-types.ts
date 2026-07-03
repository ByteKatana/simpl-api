"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { EntryType } from "@/interfaces/entry_type"

export default async function getEntryTypes(): Promise<ActionResponse<EntryType[]>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch entry types"), "server")
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryTypes = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry types")
      return handleError(unhandledError, "server")
    }
    return { success: true, status: 200, data: entryTypes } as SuccessResponse<EntryType[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
