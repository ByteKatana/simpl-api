"use server"

import { connectDB } from "@/lib/mongodb"
import { MongoClient, Collection } from "mongodb"
import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { permGroupsFormToDb } from "@/lib/form-to-db"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function updatePermissionGroups(
  formValues: z.infer<typeof PermissionGroupFormSchema>
): Promise<SuccessResponse<any> | ErrorResponse> {
  let client: MongoClient | null = null
  try {
    // 1. Authorization Check
    const session_perm_group = await getPermissionGroup()
    if (!session_perm_group) {
      return handleError(new Error("Unauthorized to update permission groups"))
    }

    // 2. Transform form values to DB structure
    const groupsToUpdate = permGroupsFormToDb(formValues)
    console.log("GROUPS_FORM", formValues, groupsToUpdate)
    const slugs = Object.keys(groupsToUpdate)
    console.log("GROUPS_ACTION", groupsToUpdate, slugs)
    if (slugs.length === 0) {
      return { success: true, status: 200, message: "No changes to update." }
    }

    // 3. Database connection
    client = await connectDB()
    const db = client.db(process.env.DB_NAME)
    const collection: Collection = db.collection("permission_groups")

    // 4. Prepare Bulk Operations
    const bulkOps = slugs.map((slug) => ({
      updateOne: {
        filter: { slug: slug },
        update: {
          $set: {
            privileges: groupsToUpdate[slug],
            updated_at: new Date().toISOString()
          }
        },
        upsert: false
      }
    }))

    // 5. Execute Bulk Write
    const result = await collection.bulkWrite(bulkOps)

    return {
      success: true,
      status: 200,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    } as SuccessResponse<any>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
