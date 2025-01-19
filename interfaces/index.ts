enum FindLike {
  StartsWith,
  EndsWith,
  Contains,
  Equals
}

export type FindType = keyof typeof FindLike

export interface EntryType {
  name: string
  namespace: string
  fields: any[]
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

export interface PermissionGroup {
  name: string
  slug: string
  privileges: any[]
}

export interface ApiKey {
  key: string
}
