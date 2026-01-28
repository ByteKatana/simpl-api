import React from "react"
import SettingsPage from "@/components/pages/settings-page.component"
import getSettings from "@/lib/actions/dashboard/settings/get-settings.action"

export default async function Page() {
  const fetchedSettings = await getSettings()
  const { permissionGroups, namespaces, apiKeys } = fetchedSettings.data
  return (
    <SettingsPage fetchedPermissionGroups={permissionGroups} fetchedNamespaces={namespaces} fetchedApiKeys={apiKeys} />
  )
}
