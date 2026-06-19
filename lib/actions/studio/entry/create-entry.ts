"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { EntryType } from "@/interfaces/entry_type"
import { Entry, EntryFormValues } from "@/interfaces/entry"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function createEntry(
  formValues: EntryFormValues,
  fetchedEntryType: EntryType
): Promise<ActionResponse<Entry>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to create entry"), "server")
    }

    const created_date = new Date().toISOString()
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formValues,
          slug: formValues.name.split(" ").join("-").toLowerCase(),
          namespace: fetchedEntryType.namespace,
          created_at: created_date,
          updated_at: created_date
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const unhandledError = new Error(data?.message || "Failed to create entry")
      return handleError(unhandledError, "server")
    }

    return { success: true, status: response.status, data } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
