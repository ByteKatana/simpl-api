import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import getUserBySlug from "@/lib/actions/studio/users/get-user-by-slug"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { auth } from "@/auth"
import ProfileForm from "@/app/studio/profile/form"

const UserProfilePage = async () => {
  const session = await auth()
  const slug = session?.id

  const usersResponse = await getUserBySlug("_id", slug)
  if (!usersResponse.success || !usersResponse.data) {
    notFound()
  }

  const fetchedUser = usersResponse.data
  console.log("FetchedUser: ", fetchedUser)

  if (!fetchedUser) {
    notFound()
  }

  const profileImgProvider = await getSettingsValue("identity_settings", "profile_img_provider")

  return (
    <div>
      <div className="flex flex-col max-w-3xl mx-auto">
        <Toaster />
        <div className="flex flex-col gap-y-0.5 mb-8">
          <h1 className="text-4xl font-bold font-sans">Profile Settings: {fetchedUser[0].username}</h1>
          <small className="text-lg text-neutral-300">Update your profile</small>
        </div>
        <div>
          <ProfileForm formPayload={fetchedUser[0]} profileImgProvider={profileImgProvider} />
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
