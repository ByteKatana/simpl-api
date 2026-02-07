"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, PermissionGroup, SuccessResponse } from "@/interfaces"

export default async function getPermissionGroups() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/v1/permission-groups/?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryTypes = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch permission groups")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryTypes } as SuccessResponse<PermissionGroup[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
