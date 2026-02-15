"use server"

import handleError from "@/lib/handlers/error"
import { Entry, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function getEntryById(id: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/_id/${id}/first_1?apikey=${process.env.API_KEY}`,
      {
        cache: "no-store"
      }
    )
    const entry = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry by id")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entry } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
