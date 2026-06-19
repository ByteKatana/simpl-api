"use server"

import { connectDB } from "@/lib/mongodb"
import { ApiKey, ActionResponse, ErrorResponse } from "@/interfaces"
import handleError from "@/lib/handlers/error"

/**
 * Retrieves information for a specific API key from MongoDB.
 *
 * @param apiKey - The plain text API key string to look up.
 * @returns An ActionResponse containing the ApiKey data if found.
 */
export async function getApiKeyInfo(apiKey: string): Promise<ActionResponse<ApiKey>> {
  try {
    const client = await connectDB()
    const db = client.db()

    const apiKeyDoc = await db.collection("api_keys").findOne({ key: apiKey })

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
      data: {
        _id: apiKeyDoc._id.toString(),
        key: apiKeyDoc.key,
        description: apiKeyDoc.description,
        permission_group: apiKeyDoc.permission_group,
        rate_limits: apiKeyDoc.rate_limits,
        created_at: apiKeyDoc.created_at
      }
    }
  } catch (error: unknown) {
    return handleError(new Error("An error occurred while retrieving API key information"), "server") as ErrorResponse
  }
}
