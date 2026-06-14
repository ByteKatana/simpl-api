"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { User } from "@/interfaces/user"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function getUsers(): Promise<ActionResponse<User>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to fetch users"))
    }

    const response = await fetch(`${process.env.BASE_URL}/api/v1/users?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryTypes = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to fetch users")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryTypes } as SuccessResponse<User[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
