"use server"

import handleError from "@/lib/handlers/error"
import { ErrorResponse, SuccessResponse, User } from "@/interfaces"

export default async function getUsers() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/v1/users?apikey=${process.env.API_KEY}`, {
      cache: "no-store"
    })
    const entryTypes = await response.json()
    if (!response.ok) {
      const unhandledError = new Error("Failed to fetch users")
      return handleError(unhandledError)
    }
    return { success: true, status: 200, data: entryTypes } as SuccessResponse<User[]>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
