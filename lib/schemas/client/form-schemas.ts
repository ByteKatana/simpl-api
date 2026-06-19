import { z } from "zod"
import { UserStatus, PublishStatus, DbDriver, IdentityManagementMode, AppearanceMode } from "@/interfaces"
import {
  SUPPORTED_AVATAR_DOMAINS,
  AVATAR_PATH_PATTERNS,
  TEMP_PERM_GROUPS,
  SUPPORTED_AVATAR_PROVIDERS
} from "@/lib/schemas/constants"

// EntryType Form Schemas
export const EntryTypeFieldFormSchema = z.object({
  instanceId: z.string(),
  type: z.string(),
  name: z.string().min(2),
  label: z.string(),
  placeholder: z.string(),
  options: z.array(z.string()),
  required: z.boolean(),
  minLength: z.number().min(1),
  maxLength: z.number().min(2),
  pattern: z.string().refine(
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
  ),
  nextFieldId: z.string().optional()
})

export const EntryTypeFieldsetFormSchema = z.object({
  instanceId: z.string(),
  name: z.string(),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-z0-9_]+$/, { message: "Slug can only contain lowercase letters, numbers, underscores" }),
  fields: z.array(EntryTypeFieldFormSchema).min(1, { message: "At least one field is required in a row" })
})

export const EntryTypeFormSchema = z.object({
  name: z.string().min(1, { message: "Entry Type Name is required" }),
  namespace: z.string().min(1, { message: "Namespace is required" }),
  fieldsets: z.array(EntryTypeFieldsetFormSchema).min(1, { message: "At least one row is required" }),
  status: z.enum([PublishStatus.Draft, PublishStatus.Published, PublishStatus.Archived], { message: "Invalid status" })
})

//Entry Form Schemas
export const EntryCreateFormSchema = z.object({
  name: z.string().min(2, { message: "Entry Name must be at least 2 characters long" }),
  status: z.enum([PublishStatus.Draft, PublishStatus.Published, PublishStatus.Archived], { message: "Invalid status" })
})

// User Form Schemas
// UserProfileImgFileSchema will be used later
/*const UserProfileImgFileSchema = z
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
  )*/

export const ThirdPartyAvatarUrlSchema = z
  .url("Avatar URL must be a valid HTTPS URL")
  .refine((url) => url.startsWith("https://"), {
    message: "Avatar URL must use HTTPS"
  })
  .refine(
    (url) => {
      try {
        const parsed = new URL(url)
        const domain = parsed.hostname.toLowerCase()
        return SUPPORTED_AVATAR_DOMAINS.some((d) => domain.includes(d))
      } catch {
        return false
      }
    },
    {
      message: `Avatar must be from a supported service: ${SUPPORTED_AVATAR_DOMAINS.join(", ")}`
    }
  )
  .refine(
    (url) => {
      try {
        return AVATAR_PATH_PATTERNS.some((pattern) => pattern.test(new URL(url).pathname))
      } catch {
        return false
      }
    },
    {
      message: "Avatar URL path does not match expected avatar service format"
    }
  )

export const UserFormSchema = z.object({
  fullname: z
    .string()
    .min(3, { message: "Fullname must be at least 3 characters." })
    .max(32, { message: "Fullname cannot exceed 32 characters." })
    .regex(/^[\w\-\s]+$/, {
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
  profile_img: z.union([/*UserProfileImgFileSchema,*/ ThirdPartyAvatarUrlSchema]).or(z.literal("")),
  status: z.enum(UserStatus, { message: "Please select a valid status" }),
  permission_group: z.enum(TEMP_PERM_GROUPS, { message: "Please select a valid permission group" }), // Replace it when you get the actual permission groups from the database(prisma)
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character." })
})

export const UserUpdateFormSchema = UserFormSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*#?&]/, { message: "Password must contain at least one special character." })
    .optional()
    .or(z.literal(""))
})

//Sign-in Schema
export const SignInFormSchema = z.object({
  email: z
    .email({ pattern: z.regexes.unicodeEmail, message: "Please enter a valid email address." })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(64, { message: "Password cannot exceed 64 characters." })
})

const ActionSchema = z.record(
  z.string(), // action keys: "read", "create", "update", "delete"
  z.boolean()
)

const ResourcePermissionsSchema = z.record(
  z.string(), // resource (namespace) keys: "entry_types", "entries", "abc", etc.
  ActionSchema
)

export const PrivilegeFormSchema = z.record(
  z.string(), // permission group key: "new_group"
  z.object({
    system: ResourcePermissionsSchema,
    namespaces: ResourcePermissionsSchema
  })
)

export const PermissionGroupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  privileges: PrivilegeFormSchema
})

// Settings Schemas
export const GeneralSettingsFormSchema = z.object({
  site_name: z.string().min(1, { message: "Site name is required" }),
  maintenance_mode: z.boolean(),
  maintenance_msg: z.string().min(1, { message: "Maintenance Message is required" }).or(z.literal("")),
  db_driver: z.enum([DbDriver.MONGO, DbDriver.POSTGRES, DbDriver.MYSQL, DbDriver.MSSQL])
})

export const BuiltInAuthMethodsFormSchema = z.object({
  email_pw: z.boolean(),
  passkeys: z.boolean(),
  otp: z.boolean(),
  two_fa: z.boolean()
})

export const ThirdPartyAuthMethodsFormSchema = z.object({
  github: z.boolean(),
  gitlab: z.boolean(),
  bitbucket: z.boolean(),
  atlassian: z.boolean(),
  vercel: z.boolean(),
  netlify: z.boolean(),
  google: z.boolean(),
  apple: z.boolean(),
  slack: z.boolean(),
  zoom: z.boolean(),
  notion: z.boolean(),
  linkedin: z.boolean(),
  click_up: z.boolean(),
  yandex_cloud: z.boolean(),
  maildotru: z.boolean(),
  hugging_face: z.boolean()
})

export const IdentitySettingsFormSchema = z.object({
  management_mode: z.enum([IdentityManagementMode.BUILT_IN, IdentityManagementMode.THIRD_PARTY]),
  auth_methods: z.object({
    built_in: BuiltInAuthMethodsFormSchema,
    third_party: ThirdPartyAuthMethodsFormSchema
  }),
  open_registration: z.boolean(),
  email_verification: z.boolean(),
  default_perm_group: z.string().min(1, { message: "Default permission group is required" }),
  profile_img_provider: z.enum(SUPPORTED_AVATAR_PROVIDERS)
})

export const RateLimitsFormSchema = z.object({
  time_window: z.number().int().min(1, { message: "Time window must be at least 1 minute" }),
  req_per_window: z.number().int().min(1, { message: "Requests per window must be at least 1" }),
  time_interval: z.number().int().min(1, { message: "Time interval must be at least 1ms" })
})
export const ApiSettingsFormSchema = z.object({
  service_rest_api: z.boolean(),
  service_graphql: z.boolean(),
  rate_limits: RateLimitsFormSchema
})

export const AppearanceSettingsFormSchema = z.object({
  mode: z.enum([AppearanceMode.SYSTEM, AppearanceMode.DARK, AppearanceMode.LIGHT])
})

// API Keys Schema
export const ApiKeyFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  permission_group: z.string().min(1, { message: "Permission group is required" }),
  rate_limits: RateLimitsFormSchema
})

// Setup
export const SetupFormSchema = z.object({
  ADMIN_FULLNAME: z.string().min(3, "Admin username must be at least 3 characters"),
  ADMIN_USERNAME: z.string().min(3, "Admin username must be at least 3 characters"),
  ADMIN_PASSWORD: z.string().min(8, "Admin password must be at least 8 characters"),
  ADMIN_EMAIL: z.email("Please enter a valid email address.").min(1, "Admin email is required")
})
