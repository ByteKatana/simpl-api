"use server"
import process from "node:process"
import { ApiKey, EntryType, ErrorResponse, PermissionGroup, SettingsData, SuccessResponse } from "@/interfaces"
import handleError from "@/lib/handlers/error"

export default async function getSettings() {
  try {
    // Fetch permission groups
    const resPermissionGroups = await fetch(
      `${process.env.BASE_URL}/api/v1/permission-groups?apikey=${process.env.API_KEY}`,
      { cache: "no-store" }
    )
    const permissionGroups: PermissionGroup = await resPermissionGroups.json()

    // Handle error for permission groups
    if (resPermissionGroups.status !== 200) {
      const unhandledError = new Error("Failed to fetch permission groups")
      return handleError(unhandledError)
    }

    // Fetch Namespaces
    const resNamespaces = await fetch(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const namespaces: EntryType = await resNamespaces.json()

    // Handle error for namespaces
    if (resNamespaces.status !== 200) {
      const unhandledError = new Error("Failed to fetch namespaces")
      return handleError(unhandledError)
    }

    // Fetch API
    const resApiKeys = await fetch(
      `${process.env.BASE_URL}/api/v1/key/list-all?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`,
      { cache: "no-store" }
    )
    const apiKeys: ApiKey[] = await resApiKeys.json()

    // Handle error for API keys
    if (resApiKeys.status !== 200) {
      const unhandledError = new Error("Failed to fetch API key")
      return handleError(unhandledError)
    }
    return {
      success: true,
      status: 200,
      data: { permissionGroups, namespaces, apiKeys }
    } as SuccessResponse<SettingsData>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
