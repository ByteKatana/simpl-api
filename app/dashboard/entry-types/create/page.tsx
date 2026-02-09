import React from "react"
import EntryTypesCreatePage from "@/components/pages/entry-types/entry-types-create-page.component"
import getEntryTypes from "@/lib/actions/dashboard/entry-types/get-entry-types"

export default async function Page() {
  const fetchedEntryTypes = await getEntryTypes()
  return <EntryTypesCreatePage fetchedEntryTypes={fetchedEntryTypes.data} />
}
