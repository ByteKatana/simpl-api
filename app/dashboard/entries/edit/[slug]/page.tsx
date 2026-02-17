import React from "react"

import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import EntryCreatePage from "@/components/pages/entries/entries-create-page.component"
import getEntryTypeBySlug from "@/lib/actions/dashboard/entry-types/get-entry-type-by-slug"
import EntryEditPage from "@/components/pages/entries/entries-edit-page.component"
import getEntryById from "@/lib/actions/dashboard/entries/get-entry-by-id"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  const fetchedEntry = await getEntryById(slug)

  // Get Entry Type Slug by Namespace
  const entryNameSpaces = fetchedEntry.data[0].namespace.split(".")
  const entryTypeSlug = entryNameSpaces[entryNameSpaces.length - 1]

  const fetchedEntryType = await getEntryTypeBySlug(entryTypeSlug)
  const fetchedPermGroups = await getPermissionGroups()
  return (
    <EntryEditPage
      fetchedEntry={fetchedEntry.data}
      fetchedEntryType={fetchedEntryType.data}
      fetchedPermGroups={fetchedPermGroups.data}
      slug={slug}
    />
  )
}
