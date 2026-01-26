import { default as nextAuthMiddleware } from "next-auth/middleware"

export function proxy(...args: Parameters<typeof nextAuthMiddleware>) {
  return nextAuthMiddleware(...args)
}

export const config = { matcher: ["/dashboard/:path*", "/api/v1/key/generate"] }
