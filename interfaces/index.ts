import { AxiosResponse } from "axios"

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

export type DataType = keyof typeof DataTypes
export type ActionType = keyof typeof ActionTypes

export type FindType = keyof typeof FindLike

export type ContentType = keyof typeof ContentTypes

export type ResponseType = "api" | "server"

export type ActionResponse<T = null> = {
  success: boolean
  status?: number
  data?: T
  error?: {
    message: string
    details?: Record<string, string[]>
  }
}

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true }
export type ErrorResponse = ActionResponse<undefined> & { success: false }

export type SettingsData = {
  permissionGroups: PermissionGroup
  namespaces: EntryType
  apiKeys: ApiKey[]
}

export interface EntryType {
  _id?: string
  name: string
  namespace: string
  fields: object[]
  createdBy?: string
}

export interface Entry {
  _id?: string
  name: string
  namespace: string
  slug: string
}

export interface User {
  _id?: string
  username: string
  password: string
  email: string
  permission_group: string
  pwchanged?: boolean
}

export interface UserCreateResponse {
  data: {
    isEmailExist: boolean
    isUsernameExist: boolean
    result: AxiosResponse
  }
  status: number
}

export interface PermissionGroup {
  _id?: string
  name: string
  slug: string
  privileges: any[]
}

export interface ApiKey {
  key: string
}

export interface DOMEvent<T extends EventTarget> extends Event {
  readonly target: T
}
