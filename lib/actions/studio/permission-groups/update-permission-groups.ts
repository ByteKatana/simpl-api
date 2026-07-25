"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { permGroupsFormToDb } from "@/lib/form-to-db"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { prisma } from "@/lib/prisma"

export default async function updatePermissionGroups(
  formValues: Pick<z.infer<typeof PermissionGroupFormSchema>, "privileges">
): Promise<ActionResponse<any>> {
  try {
    // 1. Authorization Check
    const session_perm_group = await getPermissionGroup()
    if (!session_perm_group) {
      return handleError(new Error("Unauthorized to update permission groups"), "server")
    }

    // 2. Transform form values to DB structure
    const groupsToUpdate = permGroupsFormToDb(formValues)
    const slugs = Object.keys(groupsToUpdate)
    if (slugs.length === 0) {
      return { success: true, status: 200, data: { message: "No changes to update." } }
    }

    // 3. Execute Updates via Transaction
    const updatePromises = slugs.map((slug) =>
      prisma.permissionGroup.updateMany({
        where: { slug },
        data: {
          privileges: groupsToUpdate[slug] as any
        }
      })
    )

    const results = await prisma.$transaction(updatePromises)
    const modifiedCount = results.reduce((acc, curr) => acc + curr.count, 0)

    return {
      success: true,
      status: 200,
      data: {
        matchedCount: slugs.length,
        modifiedCount: modifiedCount
      }
    } as SuccessResponse<any>
  } catch (error) {
    return handleError(error, "server")
  }
}
