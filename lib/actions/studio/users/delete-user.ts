"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { User } from "@/interfaces/user"
import { revalidatePath } from "next/cache"
import { getPermissionGroup } from "@/lib/auth/get-session"
import getUserBySlug from "@/lib/actions/studio/users/get-user-by-slug"

export default async function deleteUserAction(id: string) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to delete user"))
    }

    if (perm_group !== "root") {
      const responseTargetUser = await getUserBySlug("_id", id)
      const targetUser = responseTargetUser.data
      if (targetUser[0].permission_group === "root") {
        return handleError(new Error("Unauthorized to delete this user"))
      }
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/user/delete/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "DELETE",
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to delete the user")
      return handleError(unhandledError)
    }
    revalidatePath("/studio/users")
    return { success: true, status: 200, data } as SuccessResponse<User[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
