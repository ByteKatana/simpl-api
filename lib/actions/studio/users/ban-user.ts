"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse, UserStatus } from "@/interfaces"
import { getPermissionGroup } from "@/lib/auth/get-session"
import checkUserEmailExist from "@/lib/check-user-email-exist"

export default async function banUser(email: string, registerMode = false): Promise<any> {
  try {
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to ban user"))
      }
    }

    const userByEmail = await checkUserEmailExist({ email }, registerMode)
    const id = userByEmail[0]._id

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/user/update/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: UserStatus.Disabled
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const unhandledError = new Error(data?.message || "Failed to ban user")
      return handleError(unhandledError)
    }

    return { data, success: true, status: 200 } as SuccessResponse
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
