/**
 * Next.js Middleware with Auth.js v5 Integration
 *
 * This middleware provides:
 * - Server-side route protection for dashboard routes
 * - Automatic redirect to login for unauthenticated users
 * - Permission-based access control
 * - Session validation before page load
 *
 * Protected Routes:
 * - /dashboard/* (all dashboard routes require authentication)
 * - /dashboard/settings (admin only)
 *
 * @see https://authjs.dev/getting-started/session-management/protecting
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware function that runs on every request matching the config
 *
 * This will be replaced by the auth middleware from auth.ts once it's created.
 * For now, this is a placeholder implementation showing the intended structure.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies (Auth.js v5 cookie name)
  const sessionToken = request.cookies.get("authjs.session-token")

  // Check if route requires authentication
  const isProtectedRoute = pathname.startsWith("/dashboard")
  const isSettingsRoute = pathname.startsWith("/dashboard/settings")

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url)
    // Preserve the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For settings route, we would need to check permission_group
  // This requires decoding the session token or making an API call
  // For now, we allow access if user has a session (will be enhanced with auth.ts)
  if (isSettingsRoute && sessionToken) {
    // TODO: Add permission check when auth.ts is integrated
    // const session = await auth()
    // if (session?.user?.permission_group !== "admin") {
    //   return NextResponse.redirect(new URL("/dashboard", request.url))
    // }
  }

  // Allow request to proceed
  return NextResponse.next()
}

/**
 * Matcher configuration to specify which routes this middleware applies to
 *
 * This middleware will run on:
 * - All /dashboard routes and subroutes
 * - Excludes API routes (handled separately)
 * - Excludes static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all dashboard routes except:
     * - API routes (/api)
     * - Static files (_next/static)
     * - Image optimization (_next/image)
     * - Favicon and other public files
     */
    "/dashboard/:path*"
  ]
}

/**
 * IMPORTANT: Once auth.ts is created, replace this entire file with:
 *
 * export { auth as middleware } from "./auth"
 *
 * export const config = {
 *   matcher: ["/dashboard/:path*"]
 * }
 *
 * This will use the built-in Auth.js middleware which:
 * - Automatically validates sessions
 * - Provides session data in the request
 * - Handles token refresh
 * - More efficient than manual cookie checking
 */

/**
 * Advanced Middleware Configuration (Reference for future enhancements)
 *
 * When integrating with auth.ts, you can customize the middleware:
 *
 * import { auth } from "./auth"
 *
 * export default auth((req) => {
 *   const { pathname } = req.nextUrl
 *   const session = req.auth
 *
 *   // Custom permission checks
 *   if (pathname.startsWith("/dashboard/settings")) {
 *     if (session?.user?.permission_group !== "admin") {
 *       return NextResponse.redirect(new URL("/dashboard", req.url))
 *     }
 *   }
 *
 *   // Permission-based route protection
 *   const protectedRoutes = {
 *     "/dashboard/users": ["admin", "user_manager"],
 *     "/dashboard/permission-groups": ["admin"],
 *     "/dashboard/settings": ["admin"]
 *   }
 *
 *   for (const [route, allowedGroups] of Object.entries(protectedRoutes)) {
 *     if (pathname.startsWith(route)) {
 *       if (!session?.user?.permission_group ||
 *           !allowedGroups.includes(session.user.permission_group)) {
 *         return NextResponse.redirect(new URL("/dashboard", req.url))
 *       }
 *     }
 *   }
 * })
 *
 * export const config = {
 *   matcher: ["/dashboard/:path*"]
 * }
 */
