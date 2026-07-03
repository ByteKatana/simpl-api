"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces/"
import { PermissionGroup } from "@/interfaces/permission_group"
import { revalidatePath } from "next/cache"
import { getPermissionGroup } from "@/lib/auth/get-session"

export default async function deletePermissionGroupAction(id: string): Promise<ActionResponse<PermissionGroup[]>> {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to delete permission group"), "server")
    }

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
      return handleError(unhandledError, "server")
    }
    revalidatePath("/studio/permission-groups")
    return { success: true, status: 200, data } as SuccessResponse<PermissionGroup[]>
  } catch (error) {
    return handleError(error, "server") as ErrorResponse
  }
}
