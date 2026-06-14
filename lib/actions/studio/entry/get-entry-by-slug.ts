"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { Entry } from "@/interfaces/entry"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function getEntryBySlug(slug: string): Promise<ActionResponse<Entry>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch entry by slug"))
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/entry/${slug}?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entry = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry by slug")
      return handleError(unhandledError)
    }
    const data = Array.isArray(entry) ? entry[0] : entry
    return { success: true, status: 200, data } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
