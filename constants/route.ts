export const ROUTES = {
  HOME: "/",
  ENTRY_TYPES: "/entry-types",
  ENTRIES: "/entry",
  PERMISSION_GROUPS: "/permission-groups",
  USERS: "/users",
  SETTINGS: "/settings",
  ENTRY_TYPE: (id: string) => `/entry-type/${id}`,
  ENTRY: (id: string) => `/entry/${id}`,
  PERMISSION_GROUP: (id: string) => `/permission-group/${id}`,
  USER: (id: string) => `/user/${id}`
}
