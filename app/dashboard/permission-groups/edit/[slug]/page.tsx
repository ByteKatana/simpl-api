import React from "react"
import PermissionGroupsEditPage from "@/components/pages/permission-groups/permission-groups-edit-page.component"
import getPermissionGroupBySlug from "@/lib/actions/dashboard/permission-groups/get-permission-group-by-slug"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const fetchedPermGroup = await getPermissionGroupBySlug(slug)
  return <PermissionGroupsEditPage fetchedPermissionGroup={fetchedPermGroup.data} slug={slug} />
}
