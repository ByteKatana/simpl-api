"use server"

import { connectDB } from "@/lib/mongodb"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { SuccessResponse, ErrorResponse } from "@/interfaces"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

/**
 * Server Action: deleteApiKey
 * Deletes an API key from MongoDB by its ID.
 */
export default async function deleteApiKey(id: string): Promise<SuccessResponse<boolean> | ErrorResponse> {
  try {
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized to delete API keys")) as ErrorResponse
    }

    const client = await connectDB()
    const db = client.db()

    const result = await db.collection("api_keys").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return handleError(new Error("API key not found or already deleted")) as ErrorResponse
    }

    revalidatePath("/studio/settings")

    return {
      success: true,
      status: 200,
      data: true
    } as SuccessResponse<boolean>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
