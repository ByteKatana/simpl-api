"use server"

import handleError from "@/lib/handlers/error"
import { EntryType, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function deletePermissionGroupAction(id: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/delete/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "DELETE",
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to delete the permission group")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data } as SuccessResponse<EntryType[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
