"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, PermissionGroup, SuccessResponse } from "@/interfaces"

export default async function updatePermissionGroup(formValues: PermissionGroup[], slug: string) {
  try {
    // Make API request using fetch
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/update/${slug}?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formValues[0].name,
          privileges: formValues[0].privileges,
          slug: formValues[0].name.split(" ").join("-").toLowerCase()
        }),
        cache: "no-store"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const error = new Error("Failed to update permission group")
      return handleError(error)
    }

    return { success: true, status: response.status, data } as SuccessResponse<PermissionGroup>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
