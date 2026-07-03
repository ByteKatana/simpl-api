import { User } from "@/interfaces/user"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"

async function checkUserOAuthExist(formValues: User, registerMode = false) {
  try {
    // Check permission first.
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to create user"))
      }
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/users/oauth_id/${formValues.oauth_id}?apikey=${process.env.API_KEY}`,
      {
        method: "GET",
        cache: "no-store"
      }
    )

    if (!response.ok) {
      return handleError(new Error(`Failed to check email existence: ${response.statusText}`))
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.log("USER_CHECK_EMAIL_EXIST_ERROR", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

export default checkUserOAuthExist
