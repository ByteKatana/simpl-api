"use server"

import handleError from "@/lib/handlers/error"
import { Entry, EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"
import { ObjectId } from "mongodb"

export default async function updateEntry(
  formValues: { _id: ObjectId } & Entry,
  fetchedEntryType: EntryType,
  slug: string | string[]
) {
  try {
    const { _id: _, ...restOfFormValues } = formValues

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/entry/update/${slug}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...restOfFormValues,
          slug: formValues.name.split(" ").join("-").toLowerCase(),
          namespace: fetchedEntryType.namespace
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
