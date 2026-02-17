"use server"

import handleError from "@/lib/handlers/error"
import { User, ErrorResponse, SuccessResponse } from "@/interfaces"

export default async function updateUser(
  formValues: User[],
  slug: string | string[],
  currentPw: string
): Promise<SuccessResponse<User> | ErrorResponse> {
  try {
    let pwChanged = false
    let password = formValues[0].password

    if (password === "") {
      password = currentPw
    }

    if (password !== currentPw) {
      pwChanged = true
    } else {
      pwChanged = false
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/user/update/${slug}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formValues[0].username,
          email: formValues[0].email,
          password: password,
          pwchanged: pwChanged,
          permission_group: formValues[0].permission_group
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const unhandledError = new Error(data?.message || "Failed to update user")
      return handleError(unhandledError)
    }

    return { success: true, status: response.status, data } as SuccessResponse<User>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
