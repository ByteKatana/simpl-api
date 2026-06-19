import { ApiKey } from "@/interfaces"

export function isValidApiKey(apiKeyData: any, apikey: string | string[] | undefined): apiKeyData is ApiKey[] {
  return Array.isArray(apiKeyData) && apiKeyData.length > 0 && "key" in apiKeyData[0] && apiKeyData[0].key === apikey
}
