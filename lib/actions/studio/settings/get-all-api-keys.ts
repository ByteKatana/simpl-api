"use server"

import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ApiKey, SuccessResponse, ActionResponse } from "@/interfaces"
import { prisma } from "@/lib/prisma"

/**
 * Server Action: getAllApiKeys
 * Fetches all API keys directly from database.
 */
export default async function getAllApiKeys(): Promise<ActionResponse<ApiKey[]>> {
  try {
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized to access API keys"), "server")
    }

    const apiKeys = await prisma.apiKey.findMany({
      orderBy: { created_at: "desc" }
    })

    return {
      success: true,
      status: 200,
      data: apiKeys as any
    } as SuccessResponse<ApiKey[]>
  } catch (error) {
    return handleError(error, "server")
  }
}
