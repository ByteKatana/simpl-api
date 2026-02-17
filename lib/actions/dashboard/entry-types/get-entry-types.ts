"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function getEntryTypes() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryTypes = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry types")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryTypes } as SuccessResponse<EntryType[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
