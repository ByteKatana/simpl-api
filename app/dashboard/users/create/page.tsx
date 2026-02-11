import React from "react"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import UsersCreatePage from "@/components/pages/users/users-create-page.component"

export default async function Page() {
  const fetchedPermGroups = await getPermissionGroups()
  return <UsersCreatePage fetchedPermissionGroups={fetchedPermGroups.data} />
}
