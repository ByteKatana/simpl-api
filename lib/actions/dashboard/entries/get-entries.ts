"use server"

import handleError from "@/lib/handlers/error"
import { Entry, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function getEntries() {
  try {
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
