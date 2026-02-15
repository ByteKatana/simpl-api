"use server"

import handleError from "@/lib/handlers/error"
import { Entry, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function deleteEntryAction(id: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/delete/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "DELETE",
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to delete the entry")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data } as SuccessResponse<Entry[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
