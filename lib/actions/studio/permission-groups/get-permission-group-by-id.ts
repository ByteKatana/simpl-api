"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"

export default async function getPermissionGroupById(id: string): Promise<ActionResponse<PermissionGroup>> {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/${id}?apikey=${process.env.API_KEY}`,
      {
        cache: "no-store"
      }
    )
    const entryType = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to fetch permission group by slug")
      return handleError(unhandledError, "server")
    }
    const data = Array.isArray(entryType) ? entryType[0] : entryType
    return { success: true, status: 200, data } as SuccessResponse<PermissionGroup>
  } catch (error) {
    return handleError(error, "server")
  }
}
