/**
 * Server-Side Session Helper for Auth.js v5
 *
 * This utility provides a convenient way to access session data in:
 * - Server Components (App Router)
 * - Server Actions
 * - API Route Handlers
 * - Middleware
 *
 * Usage Examples:
 *
 * 1. In Server Components:
 *    ```tsx
 *    import { getServerSession } from "@/lib/auth/get-session"
 *
 *    export default async function DashboardPage() {
 *      const session = await getServerSession()
 *      if (!session) redirect("/login")
 *      return <div>Welcome {session.user.username}</div>
 *    }
 *    ```
 *
 * 2. In Server Actions:
 *    ```tsx
 *    "use server"
 *    import { getServerSession } from "@/lib/auth/get-session"
 *
 *    export async function updateProfile(data: FormData) {
 *      const session = await getServerSession()
 *      if (!session) throw new Error("Unauthorized")
 *      // ... update logic
 *    }
 *    ```
 *
 * 3. In API Routes:
 *    ```tsx
 *    import { getServerSession } from "@/lib/auth/get-session"
 *
 *    export async function GET() {
 *      const session = await getServerSession()
 *      if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })
 *      return Response.json({ data: "protected data" })
 *    }
 *    ```
 */

import { Session } from "next-auth"

/**
 * Get the current session on the server side
 *
 * This function wraps the auth() function from auth.ts for convenience.
 * Once auth.ts is created, this will use the actual auth() export.
 *
 * @returns Promise<Session | null> - The current session or null if not authenticated
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    // Import auth dynamically to handle case where auth.ts doesn't exist yet
    const { auth } = await import("../../auth")
    const session = await auth()
    return session
  } catch (error) {
    console.error("Error getting server session:", error)
    console.warn(
      "auth.ts not found. This helper requires auth.ts to be created with auth() export."
    )
    return null
  }
}

/**
 * Get session and require authentication
 *
 * Throws an error if user is not authenticated.
 * Use this in Server Actions or API routes where you want to enforce authentication.
 *
 * @throws Error if no session exists
 * @returns Promise<Session> - The current session (guaranteed to exist)
 *
 * @example
 * ```tsx
 * "use server"
 * export async function deleteEntry(id: string) {
 *   const session = await requireAuth()
 *   // session is guaranteed to exist here
 *   if (session.user.permission_group !== "admin") {
 *     throw new Error("Admin access required")
 *   }
 * }
 * ```
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}

/**
 * Get session with type safety and custom fields
 *
 * Returns session with properly typed custom fields (id, username, permission_group)
 *
 * @returns Promise<ExtendedSession | null>
 */
export async function getServerSessionWithUser() {
  const session = await getServerSession()
  if (!session) return null

  // Type assertion to ensure custom fields are available
  return session as Session & {
    id: string
    user: {
      email: string
      username: string
      permission_group: string
      name?: string | null
      image?: string | null
    }
  }
}

/**
 * Check if user has specific permission
 *
 * @param requiredPermission - The permission to check against user's permission_group
 * @returns Promise<boolean> - True if user has the permission
 *
 * @example
 * ```tsx
 * const hasAdminAccess = await hasPermission("admin")
 * if (!hasAdminAccess) {
 *   throw new Error("Admin access required")
 * }
 * ```
 */
export async function hasPermission(requiredPermission: string): Promise<boolean> {
  const session = await getServerSessionWithUser()
  if (!session) return false
  return session.user.permission_group === requiredPermission
}

/**
 * Check if user is authenticated (simple boolean check)
 *
 * @returns Promise<boolean> - True if user is authenticated
 *
 * @example
 * ```tsx
 * const isAuth = await isAuthenticated()
 * if (!isAuth) {
 *   redirect("/login")
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return session !== null
}

/**
 * Get user ID from session
 *
 * Convenience method to quickly get the current user's ID
 *
 * @returns Promise<string | null> - User ID or null if not authenticated
 *
 * @example
 * ```tsx
 * const userId = await getUserId()
 * if (!userId) throw new Error("User not found")
 * ```
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSessionWithUser()
  return session?.id ?? null
}

/**
 * Get user permission group from session
 *
 * Convenience method to quickly get the current user's permission group
 *
 * @returns Promise<string | null> - Permission group or null if not authenticated
 *
 * @example
 * ```tsx
 * const permGroup = await getPermissionGroup()
 * if (permGroup === "admin") {
 *   // Show admin features
 * }
 * ```
 */
export async function getPermissionGroup(): Promise<string | null> {
  const session = await getServerSessionWithUser()
  return session?.user.permission_group ?? null
}

/**
 * Type guard to check if session has required custom fields
 *
 * @param session - Session to check
 * @returns boolean - True if session has custom fields
 */
export function hasCustomFields(session: Session | null): session is Session & {
  id: string
  user: {
    username: string
    permission_group: string
  }
} {
  if (!session) return false
  return (
    "id" in session &&
    "user" in session &&
    "username" in session.user &&
    "permission_group" in session.user
  )
}

// Export types for convenience
export type { Session } from "next-auth"
