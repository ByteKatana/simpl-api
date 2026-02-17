"use server"

import handleError from "@/lib/handlers/error"
import { ApiKey, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function generateApiKeyAction() {
  try {
    const result = await fetch(`${process.env.BASE_URL}/api/v1/key/generate?secretkey=${process.env.SECRET_KEY}`, {
      cache: "no-store"
    })
    const generatedApiKeyData = await result.json()
    if (result.status !== 200) {
      const unhandledError = new Error("Failed to generate API key")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: generatedApiKeyData } as SuccessResponse<ApiKey>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
