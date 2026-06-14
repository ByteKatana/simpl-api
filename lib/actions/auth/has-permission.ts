"use server"

import { auth } from "@/auth"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { ActionResponse } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"

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

  try {
    const groups = await getPermissionGroups()
    const group = groups.data?.find((g: object) => g.slug === userGroupName) //TODO: Fix TS2339

    if (!group || !group.privileges) {
      return false
    }

    const reqPerm = requiredPermission.split(".").slice(-1)[0]
    const namespace = requiredPermission.split(".").slice(0, -1).join(".")
    const privileges = group.privileges as object[]

    const privilege = privileges.find((privilege: any) => privilege[namespace])

    let hasPerm = false
    if (privilege) {
      //TODO: Fix TS7053
      hasPerm = privilege[namespace].permissions.includes(reqPerm)
    }

    return hasPerm
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}
