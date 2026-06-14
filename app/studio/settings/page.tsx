import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettingsForm from "@/app/studio/settings/general-settings-form"
import IdentitySettingsForm from "@/app/studio/settings/identity-settings-form"
import ApiSettingsForm from "@/app/studio/settings/api-settings.form"
import PermissionGroupSettingsForm from "@/app/studio/settings/perm-group-form"
import getAllSettings from "@/lib/actions/studio/settings/get-all-settings"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { Toaster } from "@/components/ui/sonner"
import AppearanceSettingsForm from "@/app/studio/settings/appearance-settings-form"
import getAllApiKeys from "@/lib/actions/studio/settings/get-all-api-keys"
import SettingsTablist from "@/components/studio/settings/settings-tablist"

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page"
}

const SettingsStudioPage = async ({ searchParams }: { searchParams: { tab: string } }) => {
  const params = await searchParams
  const validSection = ["general", "identity", "permission-groups", "api", "appearance"]

  // Settings
  const settingsResponse = await getAllSettings()
  const allSettings = settingsResponse.data
  const generalSettings = allSettings.filter((settings) => settings.name === "general_settings")[0]
  const identitySettings = allSettings.filter((settings) => settings.name === "identity_settings")[0]
  const apiSettings = allSettings.filter((settings) => settings.name === "api_settings")[0]
  const appearanceSettings = allSettings.filter((settings) => settings.name === "appearance_settings")[0]

  // Permission Groups
  const responsePermGroups = await getPermissionGroups()
  const permGroups = responsePermGroups.data

  //Namespaces
  const responseNamespaces = await getEntryTypes()
  const namespaces = responseNamespaces.data

  // API Keys
  const responseApiKeys = await getAllApiKeys()
  const apiKeys = responseApiKeys.data

  return (
    <PermissionGuard reqPermission={["system.settings.update"]} isPage={true}>
      <div className="flex flex-col gap-y-10 ">
        <Toaster />
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl text-balance font-sans">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage the site-wide settings</p>
          </div>
          <div className="flex gap-2">{/* Add Buttons here if you want */}</div>
        </div>
        <div className="flex gap-x-4 items-start">
          <div className="flex flex-col gap-y-2">
            <Tabs defaultValue={`${validSection.includes(params.tab) ? params.tab : "general"}`} orientation="vertical">
              <TabsList>
                <SettingsTablist />
              </TabsList>
              <TabsContent value="general">
                <div className="flex flex-col gap-y-1 p-5 bg-secondary">
                  <h4 className="font-base text-xl font-sans">General Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage the general settings of the site</p>
                  <GeneralSettingsForm formValues={generalSettings} />
                </div>
              </TabsContent>
              <TabsContent value="identity">
                <div className="flex flex-col gap-y-1 p-5 bg-secondary">
                  <h4 className="font-base text-xl font-sans">Identity Management Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage settings how identity management works</p>
                  <IdentitySettingsForm formValues={identitySettings} permGroups={permGroups} />
                </div>
              </TabsContent>
              <TabsContent value="permission-groups">
                <div className="flex flex-col gap-y-1 p-5 bg-secondary">
                  <h4 className="font-base text-xl font-sans">Permission Groups Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage privileges of permission groups</p>
                  <PermissionGroupSettingsForm permGroups={permGroups} namespaces={namespaces} />
                </div>
              </TabsContent>
              <TabsContent value="api">
                <div className="flex flex-col gap-y-1 p-5 bg-secondary">
                  <h4 className="font-base text-xl font-sans">API Management Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage rate limiting and other API related settings</p>
                  <ApiSettingsForm formValues={apiSettings} apiKeys={apiKeys} />
                </div>
              </TabsContent>
              <TabsContent value="appearance">
                <div id="#appearance" className="flex flex-col gap-y-1 p-5 bg-secondary">
                  <h4 className="font-base text-xl font-sans">Appearance Settings</h4>
                  <p className="text-xs text-muted-foreground">Manage appearance settings</p>
                  <AppearanceSettingsForm formValues={appearanceSettings} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default SettingsStudioPage
