import { z } from "zod"
import { UserStatus } from "@/interfaces"
import { ObjectId } from "mongodb"

//Constants
const MAX_FILE_SIZE = 1024 * 1024 * 5
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_PROFILE_IMG_WIDTH = 500
const MAX_PROFILE_IMG_HEIGHT = 500

const tempPermGroups = ["admin", "editor", "viewer"] // It will be replaced with the actual permission groups from the database(prisma)

/*
 * User Schemas
 * SignInSchema -> Schema for sign in form to log in user to the simpl:api studio
 * CreateNewUser -> Schema for creating a new user
 * */
const UserProfileImgSchema = z
  .instanceof(File, { message: "Please select an image file" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024} MB`
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: "Only JPEG/JPG, PNG and WebP formats are allowed."
  })
  .refine(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const meetsDimensions = img.width <= MAX_PROFILE_IMG_WIDTH && img.height <= MAX_PROFILE_IMG_HEIGHT
            resolve(meetsDimensions)
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }),
    {
      message: `Profile image cannot exceed ${MAX_PROFILE_IMG_WIDTH}x${MAX_PROFILE_IMG_HEIGHT} pixels.`
    }
  )

export const SignInSchema = z.object({
  email: z
    .email({ pattern: z.regexes.unicodeEmail, message: "Please enter a valid email address." })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
})

export const UserCreateSchema = z.object({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  fullname: z
    .string()
    .min(3, { message: "Fullname must be at least 3 characters." })
    .max(32, { message: "Fullname cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Fullname can only contain alphanumeric characters, dashes, and underscores."
    }),
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
  profile_img: UserProfileImgSchema.optional(),
  status: z.enum(UserStatus, { message: "Please select a valid status" }),
  permission_group: z.enum(tempPermGroups, { message: "Please select a valid permission group" }), // Replace it when you get the actual permission groups from the database(prisma)
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character." }),
  created_at: z.date().default(() => new Date()),
  created_by: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "User cannot be created with invalid username."
    }),
  updated_at: z.date().default(() => new Date()),
  updated_by: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "User cannot be updated with invalid username."
    }),
  pwchanged: z.boolean().default(false)
})
export const UserUpdateSchema = z.object({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
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
  profile_img: UserProfileImgSchema.optional(),
  status: z.enum(UserStatus, { message: "Please select a valid status" }),
  permission_group: z.enum(tempPermGroups, { message: "Please select a valid permission group" }), // Replace it when you get the actual permission groups from the database(prisma)
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character." })
    .optional(),
  updated_at: z.date().default(() => new Date()),
  updated_by: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "User cannot be updated with invalid username."
    }),
  pwchanged: z.boolean().default(false)
})
export const UserDeleteSchema = z.object({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ])
})

})
