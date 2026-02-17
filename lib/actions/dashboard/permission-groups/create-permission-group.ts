"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, PermissionGroup, SuccessResponse } from "@/interfaces"

export default async function createPermissionGroup(formValues: PermissionGroup) {
  try {
    // Make API request using fetch
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formValues,
          slug: formValues.name.split(" ").join("-").toLowerCase()
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error("Failed to create permission group")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<PermissionGroup>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
