"use server"

import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ApiKeyFormSchema } from "@/lib/schemas/client/form-schemas"
import { ApiKey, SuccessResponse } from "@/interfaces"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { uid } from "uid"

export default async function generateApiKey(formValues: z.infer<typeof ApiKeyFormSchema>) {
  try {
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized"))
    }

    const validated = ApiKeyFormSchema.parse(formValues)
    const key = uid(32) // Generates 32 chars

    const client = await connectDB()
    const db = client.db() // Uses default db from connection string

    const newKey = {
      key,
      ...validated,
      created_at: new Date()
    }

    const result = await db.collection("api_keys").insertOne(newKey)
    if (!result.insertedId) {
      return handleError(new Error("Failed to generate API key"))
    }
    return {
      success: true,
      data: {
        key: newKey.key,
        description: newKey.description,
        permission_group: newKey.permission_group,
        rate_limits: newKey.rate_limits
      }
    } as SuccessResponse<ApiKey>
  } catch (error) {
    return handleError(error)
  }
}
