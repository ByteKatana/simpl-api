"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { Entry } from "@/interfaces/entry"
import { z } from "zod"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { EntryCreateSchema } from "@/lib/schemas/server/server-schemas"

export default async function updateEntry(
  formValues: Partial<z.infer<typeof EntryCreateSchema>>,
  id: string
): Promise<ActionResponse<Entry>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to update entry"), "server")
    }

    const { _id: _, ...restOfFormValues } = formValues

    const newSlug = formValues.name!.split(" ").join("-").toLowerCase()
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
      return handleError(unhandledError, "server")
    }

    return { success: true, status: response.status, data } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
