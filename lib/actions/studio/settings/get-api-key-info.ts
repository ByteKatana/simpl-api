"use server"

import { ApiKey, ActionResponse, ErrorResponse } from "@/interfaces"
import handleError from "@/lib/handlers/error"
import { prisma } from "@/lib/prisma"

/**
 * Retrieves information for a specific API key from database.
 *
 * @param apiKey - The plain text API key string to look up.
 * @returns An ActionResponse containing the ApiKey data if found.
 */
export async function getApiKeyInfo(apiKey: string): Promise<ActionResponse<ApiKey>> {
  try {
    const apiKeyDoc = await prisma.apiKey.findFirst({
      where: { key: apiKey }
    })

    if (!apiKeyDoc) {
      return {
        success: false,
        error: {
          message: "Invalid API key"
        },
        status: 404
      }
    }

    return {
      success: true,
      status: 200,
      data: apiKeyDoc as any
    }
  } catch (error: unknown) {
    return handleError(new Error("An error occurred while retrieving API key information"), "server") as ErrorResponse
  }
}
