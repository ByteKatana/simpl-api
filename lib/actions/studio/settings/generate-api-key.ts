"use server"

import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { ApiKeyFormSchema } from "@/lib/schemas/client/form-schemas"
import { ActionResponse, ApiKey, SuccessResponse } from "@/interfaces"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { uid } from "uid"

export default async function generateApiKey(
  formValues: z.infer<typeof ApiKeyFormSchema>
): Promise<ActionResponse<ApiKey>> {
  try {
    const permGroup = await getPermissionGroup()
    if (!permGroup) {
      return handleError(new Error("Unauthorized"), "server")
    }

    const validated = ApiKeyFormSchema.parse(formValues)
    const key = uid(32) // Generates 32 chars

    const newKey = await prisma.apiKey.create({
      data: {
        key,
        description: validated.description,
        permission_group: validated.permission_group,
        rate_limits: validated.rate_limits,
      }
    })

    return {
      success: true,
      data: {
        key: newKey.key,
        description: newKey.description,
        permission_group: newKey.permission_group,
        rate_limits: newKey.rate_limits
      }
    } as SuccessResponse<ApiKey>
  } catch (error) {
    return handleError(error, "server")
  }
}
