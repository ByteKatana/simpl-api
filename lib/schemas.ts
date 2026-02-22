import { z } from "zod"

export const SignInSchema = z.object({
  email: z
    .email({ pattern: z.regexes.unicodeEmail, message: "Please enter a valid email address." })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
})

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain alphanumeric characters, dashes, and underscores."
    }),
  email: z
    .email({ pattern: z.regexes.unicodeEmail, message: "Please enter a valid email address." })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character." })
})
