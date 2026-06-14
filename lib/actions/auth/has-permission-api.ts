"use server"

import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { getApiKeyInfo } from "@/lib/actions/studio/settings/get-api-key-info"
import { ApiKey, DbPrivilege } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { z, ZodString } from "zod"

/**
 * Server action to check if the api key has a specific permission.
 *
 * @param apiKey - Api key as string
 * @param requiredPermission - Permission string in format "system.feature.action" or "namespace.action"
 * @returns Promise<boolean> - True if api key has the permission
 */
export async function hasPermissionApi(apiKey: Pick<ApiKey, "key">, requiredPermission: string): Promise<boolean> {
  const sysApiKey = process.env.API_KEY as z.infer<typeof ZodString>
  if (apiKey.key === sysApiKey) return true // Allow acces to System API Key

  const responseApiKeyInfo = await getApiKeyInfo(apiKey)
  const apiKeyInfo = responseApiKeyInfo.data

  if (!apiKeyInfo?.permission_group) {
    return false
  }

  const apiGroupName = apiKeyInfo.permission_group
  console.log("apiGroupName", apiGroupName)
  try {
    const groups = await getPermissionGroups(true)
    const group = groups.data?.find((g: PermissionGroup) => g.slug === apiGroupName)

    if (!group || !group.privileges) {
      return false
    }

    const reqPerm = requiredPermission.split(".").slice(-1)[0]
    const namespace = requiredPermission.split(".").slice(0, -1).join(".")
    const privileges = group.privileges as unknown as DbPrivilege[]

    const privilege = privileges.find((p: DbPrivilege) => p[namespace])

    let hasPerm = false
    if (privilege) {
      hasPerm = privilege[namespace].permissions.includes(reqPerm)
    }

    return hasPerm
  } catch (error) {
    console.error("Error checking permissions:", error)
    return false
  }
}
