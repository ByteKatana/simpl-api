"use server"

import handleError from "@/lib/handlers/error"
import { ActionResponse, ErrorResponse, SuccessResponse } from "@/interfaces"
import { User } from "@/interfaces/user"

type slugType = "_id" | "username" | "email"

export default async function getUserBySlug(slugType: slugType, query: string): Promise<ActionResponse<User>> {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/v1/users/${slugType}/${query}?apikey=${process.env.API_KEY}`,
      {
        cache: "no-store"
      }
    )
    const user = await response.json()
    if (response.status !== 200) {
      const unhandledError = new Error("Failed to fetch entry type")
      return handleError(unhandledError)
    }

    const data = Array.isArray(user) ? user[0] : user
    return { success: true, status: 200, data } as SuccessResponse<User>
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}
