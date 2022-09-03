enum FindLike {
  StartsWith,
  EndsWith,
  Contains,
  Equals
}

export type FindType = keyof typeof FindLike

export type EntryType = {
  name: string
  namespace: string
  fields: Array<any>
}

export type Entry = {
  name: string
  namespace: string
  slug: string
}

export type User = {
  username: string
  password: string
  email: string
  permission_group: string
  pwchanged?: boolean
}

export type PermissionGroup = {
  name: string
  slug: string
  privileges: Array<any>
}

export type ApiKey = {
  key: string
}
