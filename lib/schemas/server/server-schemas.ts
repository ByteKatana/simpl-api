import { z } from "zod"
import { ObjectId } from "mongodb"
import {
  ApiKeyFormSchema,
  ApiSettingsFormSchema,
  AppearanceSettingsFormSchema,
  EntryCreateFormSchema,
  EntryTypeFieldFormSchema,
  EntryTypeFormSchema,
  GeneralSettingsFormSchema,
  IdentitySettingsFormSchema,
  PermissionGroupFormSchema,
  UserFormSchema
} from "@/lib/schemas/client/form-schemas"

export const UserCreateSchema = UserFormSchema.extend({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  created_at: z.iso.date().default(() => new Date().toISOString()),
  created_by: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "User cannot be created with invalid username."
    }),
  updated_at: z.iso.date().default(() => new Date().toISOString()),
  updated_by: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(32, { message: "Username cannot exceed 32 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "User cannot be updated with invalid username."
    }),
  oauth_id: z.string().optional(),
  oauth_provider: z.string().optional(),
  email_verified: z.boolean().default(false)
})

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
  instanceId: formData.instanceId,
  type: formData.type,
  name: formData.name,
  label: formData.label,
  placeholder: formData.placeholder,
  options: formData.options,
  validation: {
    required: formData.required,
    minLength: formData.minLength,
    maxLength: formData.maxLength,
    pattern: formData.pattern
  },
  nextFieldId: formData.nextFieldId
}))

export const EntryTypeSchema = EntryTypeFormSchema.extend({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  slug: z.string().min(1, { message: "Slug is required" }).max(255, { message: "Slug cannot exceed 255 characters" }),
  createdBy: z.string(),
  created_at: z.date(),
  updated_at: z.date().optional()
})

/*
 * Entry Schemas
 * EntryCreateSchema -> Schema for creating a new entry
 * EntryUpdateSchema -> Schema for updating an entry
 * EntryDeleteSchema -> Schema for deleting an entry
 * */
export const EntryCreateSchema = EntryCreateFormSchema.extend({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  namespace: z.string().min(1),
  slug: z.string().min(1, { message: "Slug is required" }),
  data: z.object(),
  created_at: z.date().default(() => new Date()),
  created_by: z.string().optional(),
  updated_at: z.date().default(() => new Date()),
  updated_by: z.string().optional()
})

// Permission Group Schema
export const PermissionGroupSchema = PermissionGroupFormSchema.extend({
  _id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  slug: z.string().min(1, "Slug is required"),
  updated_at: z.date().default(() => new Date())
}).transform((formData: any) => ({
  ...formData,
  _id: formData._id.toString()
}))

// Settings Schema
export const GeneralSettingsSchema = GeneralSettingsFormSchema.extend({
  id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  name: z.string().min(1, "Name is required"),
  settings: GeneralSettingsFormSchema
}).transform((formData) => ({
  id: formData.id,
  name: formData.name,
  settings: formData.settings
}))

export const IdentitySettingsSchema = IdentitySettingsFormSchema.extend({
  id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  name: z.string().min(1, "Name is required"),
  settings: IdentitySettingsFormSchema
}).transform((formData) => ({
  id: formData.id,
  name: formData.name,
  settings: formData.settings
}))

export const ApiSettingsSchema = ApiSettingsFormSchema.extend({
  id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  name: z.string().min(1, "Name is required"),
  settings: ApiSettingsFormSchema
}).transform((formData) => ({
  id: formData.id,
  name: formData.name,
  settings: formData.settings
}))

export const AppearanceSettingsSchema = AppearanceSettingsFormSchema.extend({
  id: z.union([
    z.instanceof(ObjectId),
    z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })
  ]),
  name: z.string().min(1, "Name is required"),
  settings: AppearanceSettingsFormSchema
}).transform((formData) => ({
  id: formData.id,
  name: formData.name,
  settings: formData.settings
}))

export const SettingsSchema = z.object({
  id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  name: z.string().min(1, "Name is required"),
  settings: z.json()
})

// API Key Schema

export const ApiKeySchema = ApiKeyFormSchema.extend({
  _id: z
    .union([z.instanceof(ObjectId), z.string().refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" })])
    .optional(),
  key: z.string(),
  created_at: z.date().default(() => new Date())
})
