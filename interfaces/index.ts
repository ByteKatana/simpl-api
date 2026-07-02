import { SYSTEM_FEATURES } from "@/lib/schemas/constants"
import { ApiKeySchema } from "@/lib/schemas/server/server-schemas"
import { z } from "zod"
import { SetupFormSchema } from "@/lib/schemas/client/form-schemas"
import { PermissionGroup } from "@/interfaces/permission_group"
import { EntryType } from "@/interfaces/entry_type"
export type { Entry } from "@/interfaces/entry"

enum FindLike {
  StartsWith,
  EndsWith,
  Contains,
  Equals
}

enum ContentTypes {
  ENTRY_TYPE,
  ENTRY,
  FIELD,
  USER,
  USER_EDIT,
  PERM_GROUP,
  PERM_GROUP_EDIT
}

enum DataTypes {
  ENTRY,
  ENTRY_TYPE,
  USER,
  PERM_GROUP
}

enum ActionTypes {
  CREATE,
  UPDATE
}

export enum PublishStatus {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived"
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Disabled = "Disabled"
}

export enum CrudAction {
  LIST = "list",
  CREATE = "create",
  READ = "read",
  READ_ENTRY = "read-entry",
  UPDATE = "update",
  UPDATE_ENTRY = "update-entry",
  DELETE = "delete",
  DELETE_ENTRY = "delete-entry"
}

export enum FormMode {
  CREATE = "create",
  EDIT = "edit"
}

export enum DbDriver {
  MONGO = "mongo",
  POSTGRES = "pg",
  MYSQL = "mysql",
  MSSQL = "mssql"
}

export enum IdentityManagementMode {
  BUILT_IN = "built-in",
  THIRD_PARTY = "third-party"
}

export enum AppearanceMode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system"
}

export enum BuiltInPermGroup {
  SYS_MANAGER = "system-manager",
  VIEWER = "viewer"
}

export type SystemFeature = (typeof SYSTEM_FEATURES)[number]

export type DbPrivilege = Record<string, { permissions: string[] }>

export enum EmailVerification {
  MAGIC_LINK = "MAGIC_LINK",
  REGISTRATION = "REGISTRATION",
  OTP = "OTP"
}

export type SetupFormValues = z.infer<typeof SetupFormSchema>

export type DataType = keyof typeof DataTypes
export type ActionType = keyof typeof ActionTypes

export type FindType = keyof typeof FindLike

export type ContentType = keyof typeof ContentTypes

export type ResponseType = "api" | "server"

export type ActionResponse<T = any> =
  | {
      success: true
      status: number
      data: T
      error?: never
    }
  | {
      success: false
      status?: number
      data?: never
      error: {
        message: string
        details?: Record<string, string[]>
      }
    }

export type SuccessResponse<T = any> = ActionResponse<T> & { success: true }
export type ErrorResponse = ActionResponse & { success: false }

export interface SetupResponseData {
  adminAccount: { username: string; email: string; password: any }
  apiKey: string
}

export type SetupActionResponse = ActionResponse<SetupResponseData>

export type SettingsData = {
  permissionGroups: PermissionGroup
  namespaces: EntryType
  apiKeys: ApiKey[]
}

export type ApiKey = z.infer<typeof ApiKeySchema>

export interface DOMEvent<T extends EventTarget> extends Event {
  readonly target: T
}

export interface FormField {
  field_name: string
  field_value_type: string
  field_form_type: string
  field_length: number | string
  field_accepted_types?: string[]
}

export interface FormattedEntryType {
  name: string
  namespace: string
  createdBy?: string
}

export interface UserCreateUpdateActionResponse {
  success: boolean
  status?: number
  data?: {
    isEmailExist: boolean
    isUsernameExist: boolean
    result: any
  }
  error?: {
    message: string
    details?: Record<string, string[]>
  }
}
