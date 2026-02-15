/**
 * Auth.js v5 - Pages Router Compatibility Layer
 *
 * This file maintains backwards compatibility for the Pages Router.
 * The actual configuration is in /auth.ts (root level).
 *
 * Note: With Auth.js v5, you can use either:
 * - This Pages Router endpoint (/pages/api/auth/[...nextauth].ts)
 * - App Router endpoint (/app/api/auth/[...nextauth]/route.ts)
 * Both will work during the migration period.
 */

import NextAuth from "next-auth"
import { config } from "../../../auth"

export default NextAuth(config)
