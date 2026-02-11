import React from "react"
import PermissionGroupsEditPage from "@/components/pages/permission-groups/permission-groups-edit-page.component"
import getPermissionGroupBySlug from "@/lib/actions/dashboard/permission-groups/get-permission-group-by-slug"
import getUserById from "@/lib/actions/dashboard/users/get-user-by-id"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import UserEditPage from "@/components/pages/users/users-edit-page.component"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const fetchedUser = await getUserById(slug)
  const fetchedPermGroups = await getPermissionGroups()
  return <UserEditPage fetchedPermissionGroups={fetchedPermGroups.data} fetchedUser={fetchedUser.data} slug={slug} />
}
