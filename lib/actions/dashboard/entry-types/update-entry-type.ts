"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse, FormField, FormattedEntryType } from "@/interfaces"

export default async function updateEntryType(
  entryType: EntryType[],
  formFields: FormField[],
  slug: string
) {
  try {
    let formattedEntryType: FormattedEntryType

    // Format namespace based on entryType configuration
    if (
      entryType[0].namespace === "itself" ||
      entryType[0].namespace === entryType[0].name.split(" ").join("-").toLowerCase()
    ) {
      formattedEntryType = {
        name: entryType[0].name,
        namespace: entryType[0].name.split(" ").join("-").toLowerCase(),
        createdBy: entryType[0].createdBy
      }
    } else if (entryType[0].namespace.includes(entryType[0].name.split(" ").join("-").toLowerCase())) {
      formattedEntryType = {
        name: entryType[0].name,
        namespace: entryType[0].namespace,
        createdBy: entryType[0].createdBy
      }
    } else {
      formattedEntryType = {
        name: entryType[0].name,
        namespace: `${entryType[0].namespace.split(" ").join("-").toLowerCase()}.${entryType[0].name.split(" ").join("-").toLowerCase()}`,
        createdBy: entryType[0].createdBy
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
      `${process.env.BASE_URL}/api/v1/entry-type/update/${slug}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
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
      const error = new Error("Failed to update entry type")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
