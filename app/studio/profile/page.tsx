import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import getProfile from "@/lib/actions/studio/users/get-profile"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import ProfileForm from "@/app/studio/profile/form"

const UserProfilePage = async () => {
  const usersResponse = await getProfile()
  if (!usersResponse.success || !usersResponse.data) {
    notFound()
  }

  const fetchedUser = usersResponse.data

  const profileImgProvider = await getSettingsValue("identity_settings", "profile_img_provider")

  return (
    <div>
      <div className="flex flex-col max-w-3xl mx-auto">
        <Toaster />
        <div className="flex flex-col gap-y-0.5 mb-8">
          <h1 className="text-4xl font-bold font-sans">Profile Settings: {fetchedUser.username}</h1>
          <small className="text-lg text-neutral-300">Update your profile</small>
        </div>
        <div>
          <ProfileForm formPayload={fetchedUser} profileImgProvider={profileImgProvider} />
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
