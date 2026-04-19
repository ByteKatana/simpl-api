import { z } from "zod"
import { CrudActionSchema, PermissionGroupSchema, PrivilegeSchema } from "@/lib/schemas"

export type PermissionGroup = z.infer<typeof PermissionGroupSchema>
export type Privilege = z.infer<typeof PrivilegeSchema>
export type CrudAction = z.infer<keyof typeof CrudActionSchema>
