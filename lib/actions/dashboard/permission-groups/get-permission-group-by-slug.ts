"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function getPermissionGroupBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/${slug}?apikey=${process.env.API_KEY}`,
      {
        cache: "no-store"
      }
    )
    const entryType = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to fetch permission group by slug")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryType } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
