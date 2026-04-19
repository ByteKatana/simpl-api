import { z } from "zod"
import { UserStatus, PublishStatus, CrudAction } from "@/interfaces"
import { ObjectId } from "mongodb"

//Constants
const MAX_FILE_SIZE = 1024 * 1024 * 5
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_PROFILE_IMG_WIDTH = 500
const MAX_PROFILE_IMG_HEIGHT = 500

const tempPermGroups = ["admin", "editor", "viewer"] // It will be replaced with the actual permission groups from the database(prisma)
/*
* PERSONAL NOTE:
* Zod schema for permission groups/roles
import { Role } from '@prisma/client';
import { z } from 'zod';
export const UserRoleSchema = z.nativeEnum(Role);
* */

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
      new Promise((resolve) => {
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

/*
 * EntryType Schemas
 * EntryTypeSchema -> Schema for creating a new entry type
 * EntryTypeFieldSchema -> Schema for creating a new field in an entry type
 * */
export const EntryTypeFieldValidationSchema = z.object({
  required: z.boolean().default(false),
  minLength: z.coerce.number().min(0).optional(),
  maxLength: z.coerce.number().min(1).optional(),
  pattern: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        try {
          new RegExp(val)
          return true
        } catch (e) {
          return false
        }
      },
      {
        message: "Invalid regular expression pattern"
      }
    )
})

export const EntryTypeFieldSchema = z.object({
  instanceId: z.string().min(1),
  type: z.string().min(1),
  name: z.string().optional(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional().default([]),
  validation: EntryTypeFieldValidationSchema.optional(),
  nextFieldId: z.string().optional()
})

export const EntryTypeFieldsetSchema = z.object({
  instanceId: z.string().min(1),
  name: z.string().optional(),
  fields: z.array(EntryTypeFieldSchema).min(1, { message: "At least one field is required in a row" })
})

export const EntryTypeSchema = z.object({
  name: z.string().min(1, { message: "Entry Type Name is required" }),
  namespace: z.string().min(1, { message: "Namespace is required" }).default("itself"),
  field_structure: z.array(EntryTypeFieldsetSchema).min(1, { message: "At least one row is required" })
})

/*
 * Entry Schemas
 * EntryCreateSchema -> Schema for creating a new entry
 * EntryUpdateSchema -> Schema for updating an entry
 * EntryDeleteSchema -> Schema for deleting an entry
 * */
export const EntryCreateSchema = z.object({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, { message: "Entry Name is required" }),
  entry_type: z.object({
    _id: z.union([
      z.instanceof(ObjectId),
      z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
    ]),
    name: z.string().min(1),
    namespace: z.string().min(1)
  }),
  slug: z.string().min(1, { message: "Slug is required" }),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.Draft),
  data: z.object(z.any()).optional(), // The actual field values of the entry
  created_at: z.date().default(() => new Date()),
  created_by: z.string().optional(),
  updated_at: z.date().default(() => new Date()),
  updated_by: z.string().optional()
})

export const EntryUpdateSchema = z.object({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  name: z.string().min(1, { message: "Entry Name is required" }).optional(),
  slug: z.string().min(1, { message: "Slug is required" }).optional(),
  status: z.nativeEnum(PublishStatus).optional(),
  data: z.object(z.any()).optional(),
  updated_at: z.date().default(() => new Date()),
  updated_by: z.string().optional()
})

export const EntryDeleteSchema = z.object({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ])
})

// Enum for CRUD actions

export const CrudActionSchema = z.nativeEnum(CrudAction)

// Privilege Schema
export const PrivilegeSchema = z.object({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  perm_group: z.string().min(1, "Permission Group is required"),
  namespace: z.object({
    _id: z.union([
      z.instanceof(ObjectId),
      z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
    ]),
    namespace: z.string().min(1, "Namespace is required")
  }),
  action: CrudActionSchema,
  privilege: z.string().min(1, "Privilege string is required")
})

// Permission Group Schema
export const PermissionGroupSchema = z.object({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  privileges: z.array(PrivilegeSchema).default([]) // Now strictly uses PrivilegeSchema
})
