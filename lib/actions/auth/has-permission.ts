"use server"

import { auth } from "@/auth"
import { DbPrivilege } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { connectDB } from "@/lib/mongodb"

/**
 * Server action to check if the current user has a specific permission.
 *
 * @param requiredPermission - Permission string in format "system.feature.action" or "namespace.action"
 * @returns Promise<boolean> - True if user has the permission
 */
export async function hasPermission(requiredPermission: string): Promise<boolean> {
  const session = await auth()

  if (!session?.user?.permission_group) {
    return false
  }

  const userGroupName = session.user.permission_group
  console.log("userGroupName", userGroupName)

  try {
    const client = await connectDB()
    const db = client.db(process.env.DB_NAME)

    // 2. Query the permission_groups collection
    // We filter out the 'root' group to match the logic previously handled by the API route
    const groups = await db.collection("permission_groups").find({}).toArray()
    const group = groups?.find((g: PermissionGroup) => g.slug === userGroupName)
    if (!group || !group.privileges) {
      return false
    }

    const reqPerm = requiredPermission.split(".").slice(-1)[0]
    const namespace = requiredPermission.split(".").slice(0, -1).join(".")
    const privileges = group.privileges as unknown as DbPrivilege[]

    const privilege = privileges.find((p: DbPrivilege) => p[namespace])

    let hasPerm = false
    if (privilege) {
      hasPerm = privilege[namespace].permissions.includes(reqPerm)
    }

    return hasPerm
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}
