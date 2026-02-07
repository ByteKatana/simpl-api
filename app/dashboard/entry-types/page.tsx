import React from "react"
import EntryTypesIndexPage from "@/components/pages/entry-types/entry-types-index-page.component"
import getEntryTypes from "@/lib/actions/dashboard/entry-types/get-entry-types"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"

export default async function Page() {
  const fetchedEntryTypes = await getEntryTypes()
  const fetchedPermGroups = await getPermissionGroups()
  return <EntryTypesIndexPage fetchedEntryTypes={fetchedEntryTypes.data} fetchedPermGroups={fetchedPermGroups.data} />
}
