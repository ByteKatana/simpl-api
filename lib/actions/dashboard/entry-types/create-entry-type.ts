"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse, FormField, FormattedEntryType } from "@/interfaces"

export default async function createEntryType(
  entryType: EntryType,
  formFields: FormField[],
  permGroup: string
) {
  try {
    let formattedEntryType: FormattedEntryType

    // Format namespace based on entryType configuration
    if (
      entryType.namespace === "itself" ||
      entryType.namespace === entryType.name.split(" ").join("-").toLowerCase()
    ) {
      formattedEntryType = {
        name: entryType.name,
        namespace: entryType.name.split(" ").join("-").toLowerCase(),
        createdBy: permGroup
      }
    } else {
      formattedEntryType = {
        name: entryType.name,
        namespace: `${entryType.namespace.split(" ").join("-").toLowerCase()}.${entryType.name.split(" ").join("-").toLowerCase()}`,
        createdBy: permGroup
      }
    }

    // Format fields conditionally based on field_accepted_types presence
    const formattedFields = formFields.map((field) => {
      if ("field_accepted_types" in field) {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length,
            accepted_formats: field.field_accepted_types
          }
        }
      } else {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length
          }
        }
      }
    })

    // Make API request using fetch
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry-type/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formattedEntryType,
          slug: formattedEntryType.name.split(" ").join("-").toLowerCase(),
          fields: formattedFields
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error("Failed to create entry type")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
