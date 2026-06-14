"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { EntryTypeFormSchema } from "@/lib/schemas/client/form-schemas"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { z } from "zod"
import { EntryTypeSchema } from "@/lib/schemas/server/server-schemas"
import { EntryType } from "@/interfaces/entry_type"

//TODO: Fix Errors (TS2339)
export default async function createEntryType(formValues: z.infer<typeof EntryTypeFormSchema>) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to create entry type"))
    }

    // Get form values
    const { name, namespace, status, fieldsets } = formValues

    // Resolve namespace
    const resolvedNamespace =
      namespace === "itself" || namespace === name.split(" ").join("-").toLowerCase()
        ? name.split(" ").join("-").toLowerCase()
        : `${namespace.split(" ").join("-").toLowerCase()}.${name.split(" ").join("-").toLowerCase()}`

    // Merge and re-map all data into a single object
    // Re-map fieldsets: each field's flat validation props → nested validation object
    const created_date = new Date().toISOString()
    const mergedData = {
      name,
      namespace: resolvedNamespace,
      slug: name.split(" ").join("-").toLowerCase(),
      status,
      createdBy: perm_group,
      created_at: created_date,
      updated_at: created_date,
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

    // Validate the form input against EntryTypeSchema
    // EntryTypeSchema is a transform of EntryTypeFormSchema — safeParse runs
    // EntryTypeFormSchema validation first. If it fails, we return early.
    const validated = EntryTypeSchema.safeParse(formValues)

    if (!validated.success) {
      return handleError(new Error(validated.error.errors.map((e: Error) => e.message).join(", ")))
    }

    // Send the validated (merged) data to the API
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry-type/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data?.message || "Failed to create entry type")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<EntryType>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
