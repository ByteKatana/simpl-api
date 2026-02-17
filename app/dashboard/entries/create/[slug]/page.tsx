import React from "react"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import EntryCreatePage from "@/components/pages/entries/entries-create-page.component"
import getEntryTypeBySlug from "@/lib/actions/dashboard/entry-types/get-entry-type-by-slug"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const fetchedEntryType = await getEntryTypeBySlug(slug)
  const fetchedPermGroups = await getPermissionGroups()
  return (
    <EntryCreatePage fetchedPermGroups={fetchedPermGroups.data} fetchedEntryType={fetchedEntryType.data} slug={slug} />
  )
}
