/**
 * Auth.js v5 Middleware Proxy
 *
 * This proxy wraps the Auth.js middleware with custom permission-based logic
 *
 */

import { NextResponse } from "next/server"
import { auth as proxy } from "./auth"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"

// In-memory store for rate limiting
// Stores: { count: number, resetTime: number, lastRequestTime: number }
const rateLimitStore = new Map<
  string,
  {
    count: number
    resetTime: number
    lastRequestTime: number
  }
>()

export default proxy(async (req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // --- Auth.js Protection Logic --- //
  // Check if route requires authentication
  const isProtectedRoute = pathname.startsWith("/studio")
  const isApiKeyRoute = pathname === "/api/v1/key/generate"

  // Redirect to login if accessing protected route without session
  if ((isProtectedRoute || isApiKeyRoute) && !session) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  /*// Permission-based route protection
  const protectedRoutes: Record<string, string[]> = {
    "/studio/users": ["admin"],
    "/studio/permission-groups": ["admin"],
    "/studio/settings": ["admin"],
    "/api/v1/key/generate": ["admin"]
  }

  for (const [route, allowedGroups] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route) || pathname === route) {
      const userPermission = session?.user?.permission_group

      if (!userPermission || !allowedGroups.includes(userPermission)) {
        // Redirect to dashboard for unauthorized access
        return NextResponse.redirect(new URL("/studio", req.url))
      }
    }
  }*/

  // Allow request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ["/studio/:path*", "/dashboard/:path*", "/api/v1/key/generate"]
}
