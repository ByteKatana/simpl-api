"use server"

import { connectDB } from "@/lib/mongodb"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ApiKey, SuccessResponse, ErrorResponse } from "@/interfaces"

/**
 * Server Action: getAllApiKeys
 * Fetches all API keys directly from MongoDB.
 */
export default async function getAllApiKeys(): Promise<SuccessResponse<ApiKey[]> | ErrorResponse> {
  try {
    // 1. Check permissions
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized to access API keys")) as ErrorResponse
    }

    // 2. Connect to MongoDB
    const client = await connectDB()
    const db = client.db(process.env.DB_NAME)

    // 3. Fetch all API keys from the collection
    const apiKeysRaw = await db.collection("api_keys").find({}).sort({ created_at: -1 }).toArray() // Fixed typo from .toJ() to .toArray()

    // 4. Convert _id to plain string (Next.js Server Actions requirement)
    const apiKeys = apiKeysRaw.map((key) => ({
      ...key,
      _id: key._id.toString()
    }))

    // 4. Return success response
    return {
      success: true,
      status: 200,
      data: apiKeys
    } as SuccessResponse<any>
  } catch (error) {
    // 5. Centralized error handling
    return handleError(error) as ErrorResponse
  }
}
