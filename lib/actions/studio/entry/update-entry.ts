"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { Entry } from "@/interfaces/entry"
import { EntryCreateFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function updateEntry(formValues: z.infer<typeof EntryCreateFormSchema>, id: string) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to update entry"))
    }

    const { _id: _, ...restOfFormValues } = formValues
    const newSlug = formValues.name.split(" ").join("-").toLowerCase()
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/update/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...restOfFormValues,
          slug: newSlug,
          namespace: formValues.namespace,
          updated_at: new Date().toISOString()
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const unhandledError = new Error(data?.message || "Failed to update entry")
      return handleError(unhandledError)
    }

    return { success: true, status: response.status, data } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
