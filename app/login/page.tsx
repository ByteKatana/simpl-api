import LoginForm from "./LoginForm"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { Metadata } from "next"

/**
 * Login Page (App Router)
 *
 * Updated to use shadcn-compatible layout while maintaining the original
 * grid structure for the login form placement.
 */

export const metadata: Metadata = {
  title: "Login | simpl:api",
  description: "Login to simpl:api dashboard"
}

export default async function LoginPage() {
  const authMethods = await getSettingsValue("identity_settings", "auth_methods")

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-[400px]">
        <LoginForm authMethods={authMethods} />
      </div>
    </div>
  )
}
