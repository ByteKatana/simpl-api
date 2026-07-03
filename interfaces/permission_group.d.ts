import { z } from "zod"
import { PermissionGroupSchema } from "@/lib/schemas/server/server-schemas"
import { CrudActionSchema } from "@/lib/schemas/constants"

export type PermissionGroup = z.infer<typeof PermissionGroupSchema>
export type CrudAction = z.infer<keyof typeof CrudActionSchema>
