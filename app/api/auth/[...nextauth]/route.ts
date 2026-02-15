/**
 * Auth.js v5 Route Handler for App Router
 *
 * This file exports the GET and POST handlers for Auth.js v5.
 * All authentication endpoints are handled through these handlers:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/*
 * - /api/auth/session
 * - /api/auth/providers
 * - /api/auth/csrf
 */

import { handlers } from "@/auth"

export const { GET, POST } = handlers
