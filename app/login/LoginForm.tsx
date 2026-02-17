"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"

/**
 * Login Form Component (Client Component)
 *
 * Handles the login form submission using Auth.js v5.
 * Uses the signIn function from next-auth/react which automatically handles:
 * - CSRF token generation and validation
 * - Credentials provider authentication
 * - Session creation
 */
export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Auth.js v5 signIn with credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else if (result?.ok) {
        // Successful login - redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col border-2 bg-slate-200 p-10 rounded-xl">
        <div className="text-slate-800 hover:text-yellow-500 h-24 font-raleway text-6xl pl-7 mt-3">
          <a href="#">simpl:api</a>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="form-label inline-block mb-2 text-gray-700 text-xl">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            disabled={isLoading}
            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none disabled:opacity-50"
            placeholder="Email"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="password" className="form-label inline-block mb-2 text-gray-700 text-xl">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none disabled:opacity-50"
            placeholder="Password"
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={isLoading}
            className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  )
}
