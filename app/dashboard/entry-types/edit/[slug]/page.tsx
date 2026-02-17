import React from "react"
import EntryTypesEditPage from "@/components/pages/entry-types/entry-types-edit-page.component"
import getEntryTypes from "@/lib/actions/dashboard/entry-types/get-entry-types"
import getEntryTypeById from "@/lib/actions/dashboard/entry-types/get-entry-type-by-id"
import getPermissionGroups from "@/lib/actions/dashboard/permission-groups/get-permission-groups"
import { EntryType } from "@/interfaces"

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // Fetch all entry types
  const fetchedEntryTypes = await getEntryTypes()
  const entryTypes: EntryType[] = fetchedEntryTypes.data

  // Fetch specific entry type by ID
  const fetchedEntryType = await getEntryTypeById(slug)
  const entryType = fetchedEntryType.data

  // Transform fields from the fetched entry type
  const fields = []
  entryType[0].fields.map((field) => {
    const fieldKey: any = Object.keys(field)
    if ("accepted_types" in field) {
      fields.push({
        field_name: fieldKey[0],
        field_value_type: field[fieldKey]["value_type"],
        field_form_type: field[fieldKey]["form_type"],
        field_length: field[fieldKey]["length"],
        field_accepted_types: field[fieldKey]["accepted_types"]
      })
    } else {
      fields.push({
        field_name: fieldKey[0],
        field_value_type: field[fieldKey]["value_type"],
        field_form_type: field[fieldKey]["form_type"],
        field_length: field[fieldKey]["length"]
      })
    }
  })

  // Fetch permission groups
  const fetchedPermGroups = await getPermissionGroups()
  const permGroups = fetchedPermGroups.data

  // Filter entry types to exclude the current one and its parent
  const filteredEntryTypes = entryTypes.filter((entry_type) => {
    const namespaceArr = entryType[0].namespace.split(".")
    const lenNamespaceArr = namespaceArr.length
    let parentNamespace: string
    if (lenNamespaceArr >= 2) {
      parentNamespace = namespaceArr
        .slice(0, lenNamespaceArr - 1)
        .join(".")
        .toString()
    } else {
      parentNamespace = namespaceArr.slice(-1)[0]
    }
    if (entry_type.namespace === entryType[0].namespace || entry_type.namespace === parentNamespace) {
      return false
    } else {
      return true
    }
  })

  return (
    <EntryTypesEditPage
      entryTypesData={filteredEntryTypes}
      entryTypeData={entryType}
      fieldsData={fields}
      fetchedPermGroups={permGroups}
      slug={slug}
    />
  )
}
