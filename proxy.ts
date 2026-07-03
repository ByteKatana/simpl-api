/**
 * Auth.js v5 Middleware Proxy
 *
 * This proxy wraps the Auth.js middleware with custom permission-based logic
 *
 */

import { NextResponse } from "next/server"
import { auth as proxy } from "./auth"

export default proxy((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // --- Auth.js Protection Logic --- //
  // Check if route requires authentication
  const isProtectedRoute = pathname.startsWith("/studio")

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ["/studio/:path*", "/dashboard/:path*", "/api/v1/key/generate"]
}
