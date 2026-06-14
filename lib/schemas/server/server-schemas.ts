import { z } from "zod"
import { ObjectId } from "mongodb"
import {
  ApiKeyFormSchema,
  ApiSettingsFormSchema,
  AppearanceSettingsFormSchema,
  EntryCreateFormSchema,
  EntryTypeFieldFormSchema,
  EntryTypeFieldsetFormSchema,
  EntryTypeFormSchema,
  GeneralSettingsFormSchema,
  IdentitySettingsFormSchema,
  PermissionGroupFormSchema,
  UserFormSchema
} from "@/lib/schemas/client/form-schemas"

export const UserCreateSchema = UserFormSchema.transform((formData) => ({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
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
  oauth_id: z.string().optional(),
  oauth_provider: z.string().optional(),
  email_verified: z.boolean().default(false),
  ...formData
}))

/*
 * EntryType Schemas
 * EntryTypeSchema -> Schema for creating a new entry type
 * EntryTypeFieldSchema -> Schema for creating a new field in an entry type
 * */
export const EntryTypeFieldValidationSchema = EntryTypeFieldFormSchema.transform((formData) => ({
  required: formData.required,
  minLength: formData.minLength,
  maxLength: formData.maxLength,
  pattern: formData.pattern
}))

export const EntryTypeFieldSchema = EntryTypeFieldFormSchema.transform((formData) => ({
  instanceId: z.string().min(1),
  type: z.string().min(1),
  name: formData.name,
  label: formData.label,
  placeholder: formData.placeholder,
  options: formData.options,
  validation: EntryTypeFieldValidationSchema,
  nextFieldId: z.string().optional()
}))

export const EntryTypeFieldsetSchema = EntryTypeFieldsetFormSchema.transform((formData) => ({
  ...formData,
  instanceId: z.string().min(1)
}))

export const EntryTypeSchema = EntryTypeFormSchema.transform((formData) => ({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: formData.name,
  namespace: formData.namespace,
  slug: z.string().min(1, { message: "Slug is required" }).max(255, { message: "Slug cannot exceed 255 characters" }),
  fieldsets: formData.fieldsets,
  status: formData.status,
  createdBy: z.string(),
  created_at: z.date(),
  updated_at: z.date().optional()
}))

/*
 * Entry Schemas
 * EntryCreateSchema -> Schema for creating a new entry
 * EntryUpdateSchema -> Schema for updating an entry
 * EntryDeleteSchema -> Schema for deleting an entry
 * */
export const EntryCreateSchema = EntryCreateFormSchema.transform((formData) => ({
  ...formData,
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  namespace: z.string().min(1),
  slug: z.string().min(1, { message: "Slug is required" }),
  data: z.object(),
  created_at: z.date().default(() => new Date()),
  created_by: z.string().optional(),
  updated_at: z.date().default(() => new Date()),
  updated_by: z.string().optional()
}))

// Permission Group Schema
export const PermissionGroupSchema = PermissionGroupFormSchema.transform((formData) => ({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  slug: z.string().min(1, "Slug is required"),
  ...formData,
  updated_at: z.date().default(() => new Date())
}))

// Settings Schema
export const GeneralSettingsSchema = GeneralSettingsFormSchema.transform((formData) => ({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: formData
}))

export const IdentitySettingsSchema = IdentitySettingsFormSchema.transform((formData) => ({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: formData
}))

export const ApiSettingsSchema = ApiSettingsFormSchema.transform((formData) => ({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: formData
}))

export const AppearanceSettingsSchema = AppearanceSettingsFormSchema.transform((formData) => ({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: formData
}))

export const SettingsSchema = z.object({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: z.json()
})

// API Key Schema

export const ApiKeySchema = ApiKeyFormSchema.transform((formData) => ({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional()
    .toString(),
  ...formData,
  key: z.string(), // This will be generated on the server
  created_at: z.date().default(() => new Date())
}))
