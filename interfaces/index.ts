enum FindLike {
  StartsWith,
  EndsWith,
  Contains,
  Equals
}

export type Person = {
  id: string
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  gender: string
}

export type FindType = keyof typeof FindLike

export type EntryType = {
  name: string
  namespace: string
  fields: array
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
}

export type PermissionGroup = {
  name: string
  slug: string
  privileges: array
}

export type ApiKey = {
  key: string
}
