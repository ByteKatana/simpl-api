"use server"

import handleError from "@/lib/handlers/error"
import { User, ErrorResponse, UserCreateActionResponse } from "@/interfaces"

async function checkUserEmailExist(formValues: User) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/users/email/${formValues.email}?apikey=${process.env.API_KEY}`,
      {
        method: "GET",
        cache: "no-store"
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to check email existence: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.log("USER_CHECK_EMAIL_EXIST_ERROR", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

async function checkUserUsernameExist(formValues: User) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/users/username/${formValues.username}?apikey=${process.env.API_KEY}`,
      {
        method: "GET",
        cache: "no-store"
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to check username existence: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.log("USER_CHECK_USERNAME_EXIST_ERROR", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

export default async function createUser(
  formValues: User
): Promise<UserCreateActionResponse | ErrorResponse> {
  try {
    const isEmailExist = await checkUserEmailExist(formValues)
    const isUsernameExist = await checkUserUsernameExist(formValues)
    let result: any = {}

    if (isEmailExist.length <= 0 && isUsernameExist.length <= 0) {
      const response = await fetch(
        `${process.env.BASE_URL}/api/v1/user/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formValues),
          cache: "no-store"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const unhandledError = new Error(data?.message || "Failed to create user")
        return handleError(unhandledError)
      }

      result = { data, status: response.status }
    }

    const userCreateResponse: UserCreateActionResponse = {
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
