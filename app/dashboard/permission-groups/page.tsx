import React from "react"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import PermissionGroupsIndexPage from "@/components/pages/permission-groups/permission-groups-index-page.component"

export default async function Page() {
  const fetchedPermGroups = await getPermissionGroups()
  return <PermissionGroupsIndexPage fetchedPermissionGroups={fetchedPermGroups.data} />
}
