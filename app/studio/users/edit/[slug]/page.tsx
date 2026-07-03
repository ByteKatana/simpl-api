import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import UserForm from "@/app/studio/users/form"
import { FormMode } from "@/interfaces"
import getUserBySlug from "@/lib/actions/studio/users/get-user-by-slug"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { PermissionGroup } from "@/interfaces/permission_group"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"

type Props = {
  params: Promise<{ slug: string }>
}

const UserEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold">Edit User</h1>
        <small className="text-lg text-neutral-300">Missing user ID. Provide user ID in the URL.</small>
      </div>
    )
  }

  const usersResponse = await getUserBySlug("_id", slug)
  if (!usersResponse.success || !usersResponse.data) {
    notFound()
  }

  const fetchedUser = usersResponse.data
  console.log("FetchedUser: ", fetchedUser)

  if (!fetchedUser) {
    notFound()
  }

  const responsePermGroups = await getPermissionGroups()
  const permGroups: PermissionGroup[] = responsePermGroups.success ? responsePermGroups.data : []

  const profileImgProvider = await getSettingsValue("identity_settings", "profile_img_provider")

  return (
    <PermissionGuard reqPermission={["system.users.update"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold">Edit User: {fetchedUser.username}</h1>
            <small className="text-lg text-neutral-300">Update user profile and permissions</small>
          </div>
          <div>
            <UserForm
              mode={FormMode.EDIT}
              formPayload={fetchedUser}
              permGroups={permGroups}
              profileImgProvider={profileImgProvider}
            />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}

export default UserEditPage
