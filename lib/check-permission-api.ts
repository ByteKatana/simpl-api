import { ApiKey } from "@/interfaces"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
/*
 * Check if the api key has the required permissions. Higher level permission should be checked first.
 * @param apiKey: Pick<ApiKey, "key">
 * @param reqPermissions: string[]
 * @returns boolean
 */
export default async function checkPermissionApi(apiKey: Pick<ApiKey, "key">, reqPermissions: string[]) {
  let isAllowed = false

  for (const permission of reqPermissions) {
    const permType = permission.split(".")[0]
    isAllowed = await hasPermissionApi(apiKey, permission)
    if (permType === "system" && isAllowed) break
  }

  return isAllowed
}
