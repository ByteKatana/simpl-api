import React from "react"
import getEntries from "@/lib/actions/dashboard/entries/get-entries"
import EntriesIndexPage from "@/components/pages/entries/entries-index-page.component"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"

export default async function Page() {
  const fetchedEntries = await getEntries()
  const fetchedPermGroups = await getPermissionGroups()
  return <EntriesIndexPage fetchedEntries={fetchedEntries.data} fetchedPermGroups={fetchedPermGroups.data} />
}
