"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { permGroupFormToDb } from "@/lib/form-to-db"

export default async function createPermissionGroup(formValues: z.infer<typeof PermissionGroupFormSchema>) {
  try {
    // Check permission first.
    const perm_group = await getPermissionGroup()

    if (!perm_group) {
      return handleError(new Error("Unauthorized to  create permission group"))
    }

    const privileges = permGroupFormToDb(formValues)
    // Make API request using fetch
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-group/create?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formValues.name,
          privileges,
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
