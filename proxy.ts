/**
 * Auth.js v5 Middleware Proxy
 *
 * This proxy wraps the Auth.js middleware with custom permission-based logic
 *
 * Protected Routes:
 * - /dashboard/* (all dashboard routes require authentication)
 * - /dashboard/settings (admin only)
 * - /dashboard/users (admin)
 * - /dashboard/permission-groups (admin only)
 * - /api/v1/key/generate (admin only)
 */

import { NextResponse } from "next/server"
import { auth as proxy } from "./auth"

export default proxy((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Check if route requires authentication
  const isProtectedRoute = pathname.startsWith("/dashboard")
  const isApiKeyRoute = pathname === "/api/v1/key/generate"

  // Redirect to login if accessing protected route without session
  if ((isProtectedRoute || isApiKeyRoute) && !session) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Permission-based route protection
  const protectedRoutes: Record<string, string[]> = {
    "/dashboard/users": ["admin"],
    "/dashboard/permission-groups": ["admin"],
    "/dashboard/settings": ["admin"],
    "/api/v1/key/generate": ["admin"]
  }

  for (const [route, allowedGroups] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) || pathname === route) {
      const userPermission = session?.user?.permission_group

      if (!userPermission || !allowedGroups.includes(userPermission)) {
        // Redirect to dashboard for unauthorized access
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
  }

  // Allow request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/api/v1/key/generate"]
}
