import { Toaster } from "@/components/ui/sonner"
import UserForm from "@/app/studio/users/form"
import { FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { PermissionGroup } from "@/interfaces/permission_group"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"

const Page = async () => {
  const responsePermGroups = await getPermissionGroups()
  const permGroups: PermissionGroup[] = responsePermGroups.data

  const profileImgProvider = await getSettingsValue("identity_settings", "profile_img_provider")

  return (
    <PermissionGuard reqPermission={["system.users.create"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold">New User</h1>
            <small className="text-lg text-neutral-300">Create a new user</small>
          </div>
          <div>
            <UserForm mode={FormMode.CREATE} permGroups={permGroups} profileImgProvider={profileImgProvider} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}

export default Page
