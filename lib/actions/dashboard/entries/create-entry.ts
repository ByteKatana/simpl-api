"use server"

import handleError from "@/lib/handlers/error"
import { Entry, EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function createEntry(formValues: Entry, fetchedEntryType: EntryType) {
  try {
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
          namespace: fetchedEntryType.namespace
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const unhandledError = new Error(data?.message || "Failed to create entry")
      return handleError(unhandledError)
    }

    return { success: true, status: response.status, data } as SuccessResponse<Entry>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
