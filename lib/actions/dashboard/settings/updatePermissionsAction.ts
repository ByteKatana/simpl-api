"use server"

import { ErrorResponse, PermissionGroup, SuccessResponse } from "@/interfaces"
import handleError from "@/lib/handlers/error"

export default async function updatePermissionsAction(permissionGroupId: string, payload: object) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/update/${permissionGroupId}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store"
      }
    )
    const result = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to update permissions")
      return unhandledError
    }
    return { success: true, status: 200, data: result } as SuccessResponse<PermissionGroup>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
