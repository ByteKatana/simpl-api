import { User } from "@/interfaces/user"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"

async function checkUserEmailExist(formValues: Partial<User>, registerMode = false) {
  try {
    // Check permission first.
    if (!registerMode) {
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to create user"))
      }
    }

    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/users/email/${formValues.email}?apikey=${process.env.API_KEY}`,
      {
        method: "GET",
        cache: "no-store"
      }
    )

    if (!response.ok) {
      return handleError(new Error(`Failed to check email existence: ${response.statusText}`), "server")
    }

    return await response.json()
  } catch (error) {
    console.log("USER_CHECK_EMAIL_EXIST_ERROR", error instanceof Error ? error.message : "Unknown error")
    throw error
  }
}

export default checkUserEmailExist
