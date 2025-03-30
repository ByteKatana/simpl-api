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

export interface EntryType {
  name: string
  namespace: string
  fields: object[]
}

export interface Entry {
  name: string
  namespace: string
  slug: string
}

export interface User {
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
  _id: string
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
