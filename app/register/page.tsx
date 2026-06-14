import RegisterForm from "@/app/register/form"
import { getServerSession } from "@/lib/auth/get-session"
import { redirect } from "next/navigation"
import { checkRegisterOpen } from "@/lib/actions/studio/settings/check-register-open"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register | simpl:api"
}

export default async function RegisterPage() {
  //Global Settings
  const isRegistrationOpen = await checkRegisterOpen()
  const profileImgProvider = await getSettingsValue("identity_settings", "profile_img_provider")

  // Check if registration is open
  if (!isRegistrationOpen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
        <h1 className="text-2xl font-bold">Registration is closed</h1>
      </div>
    )
  }

  const authMethods = await getSettingsValue("identity_settings", "auth_methods")
  const isRegisterWithEmailAndPassword = authMethods.built_in.email_pw
  if (!isRegisterWithEmailAndPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
        <h1 className="text-2xl font-bold">Registration is allowed only with OAuth Providers</h1>
      </div>
    )
  }
  //Check if user is already logged in
  const session = await getServerSession()
  if (session) {
    redirect("/studio")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <RegisterForm profileImgProvider={profileImgProvider} />
    </div>
  )
}
