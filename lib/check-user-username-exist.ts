import { User } from "@/interfaces/user"
import { ErrorResponse, UserCreateActionResponse } from "@/interfaces"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"

async function checkUserUsernameExist(formValues: User, registerMode = false) {
  try {
    // Check permission first.
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to create user"))
      }
    }

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

export default checkUserUsernameExist
