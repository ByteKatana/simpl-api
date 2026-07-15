"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import handleError from "@/lib/handlers/error"
import { ActionResponse, SuccessResponse } from "@/interfaces"
import { User } from "@/interfaces/user"

/**
 * Get current user profile data using Prisma
 * @returns {Promise<ActionResponse<User>>} The user profile data
 */
export default async function getProfile(): Promise<ActionResponse<User>> {
  try {
    const session = await auth()
    const userId = session?.id

    if (!userId) {
      throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Map Prisma User to User interface
    // User interface expects _id, while Prisma model uses id (mapped to _id in DB)
    const profileData = {
      ...user,
      _id: user.id
    } as unknown as User

    return {
      success: true,
      status: 200,
      data: profileData
    } as SuccessResponse<User>
  } catch (error) {
    return handleError(error, "server")
  }
}
