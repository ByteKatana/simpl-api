"use server"

import handleError from "@/lib/handlers/error"
import { ApiKey, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function removeApiKeyAction(id: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/key/remove/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      { method: "DELETE", cache: "no-store" }
    )

    const result = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to delete API key")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: result } as SuccessResponse<ApiKey>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
