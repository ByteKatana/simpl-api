export const ROUTES = {
  HOME: { url: "/", title: "Home" },
  ENTRY_TYPES: { url: "/entry-types", title: "Entry Types" },
  ENTRIES: { url: "/entry", title: "Entries" },
  PERMISSION_GROUPS: { url: "/permission-groups", title: "Permission Groups" },
  USERS: { url: "/users", title: "Users" },
  SETTINGS: { url: "/settings", title: "Settings" },
  ENTRY_TYPE: (slug: string, title: string) => ({
    url: `/entry-type/${slug}`,
    title
  }),
  ENTRY: (slug: string, title: string) => ({ url: `/entry/${slug}`, title }),
  PERMISSION_GROUP: (slug: string, title: string) => ({ url: `/permission-group/${slug}`, title }),
  USER: (slug: string, title: string) => ({ url: `/user/${slug}`, title })
}
