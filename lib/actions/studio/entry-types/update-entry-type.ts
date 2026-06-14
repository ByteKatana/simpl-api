"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse, FormField, FormattedEntryType, ActionResponse } from "@/interfaces"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { EntryTypeSchema } from "@/lib/schemas/server/server-schemas"
import { EntryTypeFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"

export default async function updateEntryType(
  formValues: z.infer<typeof EntryTypeFormSchema>,
  id: string
): Promise<ActionResponse<EntryType>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to update entry type"))
    }

    // Get form values
    const { name, namespace, status, fieldsets, created_at } = formValues

    // Resolve namespace
    const resolvedNamespace =
      namespace === "itself" || namespace === name.split(" ").join("-").toLowerCase()
        ? name.split(" ").join("-").toLowerCase()
        : `${namespace.split(" ").join("-").toLowerCase()}.${name.split(" ").join("-").toLowerCase()}`

    // Merge and re-map all data into a single object
    // Re-map fieldsets: each field's flat validation props → nested validation object
    const mergedData = {
      name,
      namespace: resolvedNamespace,
      slug: name.split(" ").join("-").toLowerCase(),
      status,
      createdBy: perm_group,
      created_at,
      updated_at: new Date().toISOString(),
      fieldsets: fieldsets.map((fieldset) => ({
        instanceId: fieldset.instanceId,
        name: fieldset.name,
        slug: fieldset.slug,
        fields: fieldset.fields.map((field) => ({
          instanceId: field.instanceId,
          name: field.name.split(" ").join("_").toLowerCase(),
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          options: field.options,
          validation: {
            required: field.required,
            minLength: field.minLength,
            maxLength: field.maxLength,
            pattern: field.pattern
          },
          nextFieldId: field.nextFieldId || undefined
        }))
      }))
    }

    // Validate the form input against EntryTypeFormSchema
    const validated = EntryTypeFormSchema.safeParse(formValues)

    if (!validated.success) {
      return handleError(new Error(validated.error.errors.map((e: Error) => e.message).join(", ")), "server")
    }

    // Send the validated (merged) data to the API
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry-type/update/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to update entry type")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
