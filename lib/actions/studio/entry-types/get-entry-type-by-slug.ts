"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { EntryType } from "@/interfaces/entry_type"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function getEntryTypeBySlug(slug: string): Promise<ActionResponse<EntryType>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch entry type by slug"), "server")
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry-type/slug/${slug}?apikey=${process.env.API_KEY}`,
      {
        method: "GET",
        cache: "no-store"
      }
    )

    const data = await response.json()
    const entryType = data[0]

    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry type by slug")
      return handleError(unhandledError, "server")
    }
    return { success: true, status: 200, data: entryType } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
