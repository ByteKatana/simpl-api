"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { Entry } from "@/interfaces/entry"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function getEntries() {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch entries"))
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/entries?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entries = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entries")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entries } as SuccessResponse<Entry[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
