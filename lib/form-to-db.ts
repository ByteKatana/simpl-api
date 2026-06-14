import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { DbPrivilege } from "@/interfaces"
/**
 * Transforms a form values object containing a permission groups
 * into a record of slug to their respective database privileges.
 */
export function permGroupFormToDb(formValues: z.infer<typeof PermissionGroupFormSchema>) {
  const privileges: DbPrivilege[] = []

  if (formValues.privileges) {
    Object.values(formValues.privileges).forEach((permGroup) => {
      const systemPrivileges = permGroup.system
      const nsPrivileges = permGroup.namespaces

      // system and namespaces are Record<string, Record<string, boolean>>
      if (systemPrivileges) {
        Object.entries(systemPrivileges).forEach(([feature, actions]) => {
          const permissions: string[] = []
          Object.entries(actions).forEach(([action, enabled]) => {
            if (enabled) {
              permissions.push(action)
            }
          })
          privileges.push({
            [`system.${feature}`]: { permissions }
          })
        })
      }

      if (nsPrivileges) {
        Object.entries(nsPrivileges).forEach(([namespace, actions]) => {
          const permissions: string[] = []
          const ns = namespace.split("_DOT_").join(".")
          Object.entries(actions).forEach(([action, enabled]) => {
            if (enabled) {
              permissions.push(action)
            }
          })
          privileges.push({
            [ns]: { permissions }
          })
        })
      }
    })
  }

  return privileges
}

/**
 * Transforms a form values object containing multiple permission groups
 * into a record of slugs to their respective database privileges.
 */
export function permGroupsFormToDb(formValues: z.infer<typeof PermissionGroupFormSchema>) {
  const result: Record<string, DbPrivilege[]> = {}

  if (formValues.privileges) {
    Object.entries(formValues.privileges).forEach(([slug, permGroup]) => {
      const privileges: DbPrivilege[] = []
      const systemPrivileges = permGroup.system
      const nsPrivileges = permGroup.namespaces

      if (systemPrivileges) {
        Object.entries(systemPrivileges).forEach(([feature, actions]) => {
          const permissions: string[] = []
          Object.entries(actions).forEach(([action, enabled]) => {
            if (enabled) permissions.push(action)
          })
          if (permissions.length > 0) {
            privileges.push({ [`system.${feature}`]: { permissions } })
          }
        })
      }

      if (nsPrivileges) {
        Object.entries(nsPrivileges).forEach(([namespace, actions]) => {
          const permissions: string[] = []
          const ns = namespace.split("_DOT_").join(".")
          Object.entries(actions).forEach(([action, enabled]) => {
            if (enabled) permissions.push(action)
          })
          if (permissions.length > 0) {
            privileges.push({ [ns]: { permissions } })
          }
        })
      }

      result[slug] = privileges
    })
  }

  return result
}
