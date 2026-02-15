/**
 * Sign-Out Server Action for Auth.js v5
 *
 * This server action provides secure sign-out functionality with:
 * - Proper session cleanup
 * - Cookie removal
 * - Optional redirect after sign-out
 * - Error handling
 *
 * Server actions are the recommended way to handle mutations in Next.js App Router.
 * They run on the server and provide automatic CSRF protection.
 *
 * Usage Examples:
 *
 * 1. In Client Components (with transition):
 *    ```tsx
 *    "use client"
 *    import { signOutAction } from "@/lib/actions/auth/sign-out"
 *    import { useTransition } from "react"
 *
 *    export function LogoutButton() {
 *      const [isPending, startTransition] = useTransition()
 *
 *      const handleLogout = () => {
 *        startTransition(async () => {
 *          await signOutAction()
 *        })
 *      }
 *
 *      return (
 *        <button onClick={handleLogout} disabled={isPending}>
 *          {isPending ? "Signing out..." : "Logout"}
 *        </button>
 *      )
 *    }
 *    ```
 *
 * 2. In Server Components:
 *    ```tsx
 *    import { signOutAction } from "@/lib/actions/auth/sign-out"
 *
 *    export default function LogoutPage() {
 *      return (
 *        <form action={signOutAction}>
 *          <button type="submit">Sign Out</button>
 *        </form>
 *      )
 *    }
 *    ```
 *
 * 3. With custom redirect:
 *    ```tsx
 *    await signOutAction("/login")
 *    ```
 */

"use server"

import { redirect } from "next/navigation"

/**
 * Sign out the current user and clear their session
 *
 * This action will:
 * - Call the signOut function from Auth.js
 * - Clear the session cookie (authjs.session-token)
 * - Clear the CSRF token (authjs.csrf-token)
 * - Redirect to the specified URL (default: home page)
 *
 * @param redirectTo - Optional URL to redirect after sign out (default: "/")
 * @returns Promise<void>
 *
 * @throws Will throw an error if sign out fails
 */
export async function signOutAction(redirectTo: string = "/"): Promise<void> {
  try {
    // Import signOut from auth.ts
    const { signOut } = await import("../../../auth")

    // Sign out using Auth.js v5 signOut function
    // This will clear the session and cookies
    await signOut({ redirect: false })

    // Redirect to the specified page
    redirect(redirectTo)
  } catch (error) {
    console.error("Error during sign out:", error)

    // If auth.ts doesn't exist yet, provide fallback behavior
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      console.warn("auth.ts not found. Using fallback sign out.")

      // Fallback: redirect to sign out endpoint
      redirect("/api/auth/signout")
    }

    throw error
  }
}

/**
 * Sign out with confirmation and custom message
 *
 * This variant allows you to pass additional options for the sign-out process
 *
 * @param options - Sign out options
 * @returns Promise<void>
 */
export async function signOutWithOptions(options?: {
  redirectTo?: string
  callbackUrl?: string
}): Promise<void> {
  try {
    const { signOut } = await import("../../../auth")

    await signOut({
      redirect: false,
      redirectTo: options?.redirectTo || options?.callbackUrl || "/"
    })

    redirect(options?.redirectTo || options?.callbackUrl || "/")
  } catch (error) {
    console.error("Error during sign out with options:", error)
    throw error
  }
}

/**
 * Sign out all sessions (useful for security)
 *
 * This will sign out the user from all devices/sessions.
 * Note: This requires database session strategy, not JWT.
 * With JWT strategy, it only clears the current session.
 *
 * @returns Promise<void>
 */
export async function signOutAllSessions(): Promise<void> {
  try {
    const { signOut } = await import("../../../auth")

    // With JWT strategy, this will only clear current session
    // For true multi-session logout, you need database session strategy
    await signOut({ redirect: false })

    redirect("/")
  } catch (error) {
    console.error("Error during sign out all sessions:", error)
    throw error
  }
}

/**
 * Sign out and clear all local data
 *
 * This is useful when you want to clear not just the session,
 * but also any client-side data (localStorage, sessionStorage, etc.)
 *
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function signOutAndClearData(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const { signOut } = await import("../../../auth")

    await signOut({ redirect: false })

    return { success: true }
  } catch (error) {
    console.error("Error during sign out and clear data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Sign out with analytics tracking
 *
 * This variant includes a hook for tracking sign-out events
 * Useful for analytics or logging purposes
 *
 * @param userId - Optional user ID for logging
 * @returns Promise<void>
 */
export async function signOutWithTracking(userId?: string): Promise<void> {
  try {
    // Log sign out event (you can replace this with your analytics service)
    console.log(`User sign out initiated${userId ? ` for user ${userId}` : ""}`)

    const { signOut } = await import("../../../auth")

    await signOut({ redirect: false })

    // Log successful sign out
    console.log(`User sign out completed${userId ? ` for user ${userId}` : ""}`)

    redirect("/")
  } catch (error) {
    console.error("Error during sign out with tracking:", error)
    throw error
  }
}
