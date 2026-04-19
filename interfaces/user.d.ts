import { z } from "zod"
import { SignInSchema, UserCreateSchema } from "@/lib/schemas"

export type User = z.infer<typeof UserCreateSchema>
export type SignIn = z.infer<typeof SignInSchema>
