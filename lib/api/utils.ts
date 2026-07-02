import { ApiKey } from "@/interfaces"
import { timingSafeEqual } from "node:crypto"

export function isValidApiKey(apiKeyData: any, apikey: string | string[] | undefined): apiKeyData is ApiKey[] {
  return Array.isArray(apiKeyData) && apiKeyData.length > 0 && "key" in apiKeyData[0] && apiKeyData[0].key === apikey
}

export function isSystemApiKey(apikey: string | string[] | undefined): boolean {
  const sysApiKey = process.env.API_KEY
  // Refuse to match when the secret is unset/empty so `undefined === undefined`
  // or empty-string requests can never slip through.
  if (!sysApiKey || typeof apikey !== "string" || apikey.length === 0) return false

  const a = Buffer.from(sysApiKey)
  const b = Buffer.from(apikey)
  if (a.length !== b.length) return false // length check guards timingSafeEqual from throwing
  return timingSafeEqual(a, b)
}
