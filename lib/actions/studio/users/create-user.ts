"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, UserCreateUpdateActionResponse } from "@/interfaces"
import { User } from "@/interfaces/user"
import { getPermissionGroup } from "@/lib/auth/get-session"
import checkUserEmailExist from "@/lib/check-user-email-exist"
import checkUserUsernameExist from "@/lib/check-user-username-exist"

export default async function createUser(
  formValues: User,
  registerMode: boolean = false
): Promise<UserCreateUpdateActionResponse | ErrorResponse> {
  try {
    // Check permission first.
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to create user"), "server")
      }

      if (perm_group !== "root" && formValues.permission_group === "root") {
        return handleError(new Error("Unauthorized to create this user"), "server")
      }
    }

    const isEmailExist = await checkUserEmailExist(formValues, registerMode)
    const isUsernameExist = await checkUserUsernameExist(formValues, registerMode)
    let result: any = {}

    if (isEmailExist.length <= 0 && isUsernameExist.length <= 0) {
      const response = await fetch(
        `${process.env.BASE_URL}/api/v1/user/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...formValues,
            email_verified: false
          }),
          cache: "no-store"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const unhandledError = new Error(data?.message || "Failed to create user")
        return handleError(unhandledError, "server")
      }

      result = { data, status: response.status }
    }

    const userCreateResponse: UserCreateUpdateActionResponse = {
      success: true,
      status: 200,
      data: {
        isEmailExist: isEmailExist.length <= 0 ? false : true,
        isUsernameExist: isUsernameExist.length <= 0 ? false : true,
        result: result
      }
    }

    return userCreateResponse
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
