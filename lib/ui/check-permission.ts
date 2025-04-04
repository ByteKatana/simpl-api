"use client"
import { Session } from "next-auth"
import { PermissionGroup } from "../../interfaces"

const checkPermission = (
  fetchedPermGroups: PermissionGroup[],
  session: Session,
  permission: string,
  namespace: string
) => {
  if (session) {
    let permGroup = fetchedPermGroups.find((group) => group.slug === session.user.permission_group)
    if (permGroup.privileges.find((privilege) => Object.keys(privilege).includes(namespace))) {
      return permGroup.privileges
        .find((privilege) => Object.keys(privilege).includes(namespace))
        [namespace].permissions.includes(permission)
    }
    return false
  }
}

export default checkPermission
