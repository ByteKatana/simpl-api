import { z } from "zod"
import { UserCreateSchema } from "@/lib/schemas/server/server-schemas"
import { SignInFormSchema } from "@/lib/schemas/client/form-schemas"

export type User = z.infer<typeof UserCreateSchema>
export type SignIn = z.infer<typeof SignInFormSchema>
