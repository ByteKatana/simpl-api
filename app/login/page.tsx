import { getCsrfToken } from "next-auth/react"
import LoginForm from "./LoginForm"

/**
 * Login Page (App Router)
 *
 * This is the main login page using Next.js App Router with Auth.js v5.
 * The page is a Server Component that fetches the CSRF token server-side.
 */

export const metadata = {
  title: "Login | simpl:api",
  description: "Login to simpl:api dashboard"
}

export default async function LoginPage() {
  // Note: In Auth.js v5 with App Router, we use a Client Component for the form
  // The CSRF token is handled automatically by the Auth.js client
  return (
    <div className="container">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <div className="grid grid-col-6 ml-10 place-content-center w-screen">
          <div className="col-start-2 col-end-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
