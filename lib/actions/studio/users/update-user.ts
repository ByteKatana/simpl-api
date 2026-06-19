"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, UserCreateUpdateActionResponse } from "@/interfaces"
import { User } from "@/interfaces/user"
import { getPermissionGroup } from "@/lib/auth/get-session"
import checkUserEmailExist from "@/lib/check-user-email-exist"
import checkUserUsernameExist from "@/lib/check-user-username-exist"
import bcrypt from "bcryptjs"

export default async function updateUser(
  formValues: Partial<User>,
  prevValues: User,
  id: string,
  registerMode = false
): Promise<UserCreateUpdateActionResponse | ErrorResponse> {
  try {
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to update user"), "server") as any
      }

      if (perm_group !== "root" && prevValues.permission_group === "root") {
        return handleError(new Error("Unauthorized to update this user"), "server") as any
      }
    }

    let isEmailExist = []
    if (prevValues.email !== formValues.email) isEmailExist = await checkUserEmailExist(formValues, registerMode)

    let isUsernameExist = []
    if (prevValues.username !== formValues.username)
      isUsernameExist = await checkUserUsernameExist(formValues, registerMode)

    let password = prevValues.password
    if (formValues.password && formValues.password !== "") {
      password = bcrypt.hashSync(formValues.password, 8)
    }

    let result: any = {}
    if (isEmailExist.length <= 0 && isUsernameExist.length <= 0) {
      const response = await fetch(
        `${process.env.BASE_URL}/api/v1/user/update/${id}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullname: formValues.fullname,
            username: formValues.username,
            email: formValues.email,
            password,
            permission_group: formValues.permission_group,
            status: formValues.status,
            profile_img: formValues.profile_img,
            oauth_id: formValues.oauth_id
          }),
          cache: "no-store"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const unhandledError = new Error(data?.message || "Failed to update user")
        return handleError(unhandledError, "server") as any
      }
      result = { data, status: response.status }
    }

    return {
      success: true,
      status: 200,
      data: {
        isEmailExist: isEmailExist.length > 0,
        isUsernameExist: isUsernameExist.length > 0,
        result: result
      }
    }
  } catch (error) {
    return handleError(error, "server") as any
  }
}
