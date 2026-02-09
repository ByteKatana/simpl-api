"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function getEntryTypeById(id: string) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/v1/entry-type/id/${id}?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryType = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry type")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryType } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
