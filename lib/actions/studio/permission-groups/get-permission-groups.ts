"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { getPermissionGroup } from "@/lib/auth/get-session"
import { prisma } from "@/lib/prisma"

export default async function getPermissionGroups(
  isCheckingApiKeyPermGroup?: boolean
): Promise<ActionResponse<PermissionGroup[]>> {
  try {
    if (!isCheckingApiKeyPermGroup) {
      // Check permission first.
      const perm_group = await getPermissionGroup()

      if (!perm_group) {
        return handleError(new Error("Unauthorized to fetch permission groups"), "server")
      }
    }

    const groups = await prisma.permissionGroup.findMany({
      where: {
        slug: {
          not: "root"
        }
      }
    })

    const formattedGroups = groups.map((group) => ({
      ...group,
      _id: group.id
    })) as unknown as PermissionGroup[]

    return {
      success: true,
      status: 200,
      data: formattedGroups
    } as SuccessResponse<PermissionGroup[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
