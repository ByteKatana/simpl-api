"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { connectDB } from "@/lib/mongodb"

export default async function getPermissionGroups(
  isCheckingApiKeyPermGroup?: boolean
): Promise<ActionResponse<PermissionGroup[]>> {
  try {
    if (!isCheckingApiKeyPermGroup) {
      // Check permission first.
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to delete entry type"), "server")
      }
    }
    // 1. Establish direct database connection
    const client = await connectDB()
    const db = client.db(process.env.DB_NAME)

    // 2. Query the permission_groups collection
    // We filter out the 'root' group to match the logic previously handled by the API route
    const groups = await db
      .collection("permission_groups")
      .find({ slug: { $ne: "root" } })
      .toArray()

    // 3. Format the data to match the PermissionGroup interface (convert ObjectId to string)
    const formattedGroups = groups.map((group) => ({
      ...group,
      _id: group._id.toString()
    })) as unknown as PermissionGroup[]

    if (!groups) {
      return handleError(new Error("Failed to fetch permission groups"), "server")
    }

    return {
      success: true,
      status: 200,
      data: formattedGroups
    } as SuccessResponse<PermissionGroup[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
