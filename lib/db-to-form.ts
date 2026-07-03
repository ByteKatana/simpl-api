import { DbPrivilege } from "@/interfaces"
import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"

export const permGroupDbToForm = (dbPrivileges: DbPrivilege[], permGroupKey: string = "new-group") => {
  const formPrivileges: z.infer<typeof PermissionGroupFormSchema>["privileges"] = {
    [permGroupKey]: {
      system: {},
      namespaces: {}
    }
  }

  if (!dbPrivileges || !Array.isArray(dbPrivileges)) {
    return formPrivileges
  }

  dbPrivileges.forEach((record) => {
    Object.entries(record).forEach(([namespace, value]) => {
      const actions: Record<string, boolean> = {}
      value.permissions.forEach((action: string) => {
        actions[action] = true
      })

      if (namespace.startsWith("system.")) {
        const feature = namespace.split(".")[1]
        formPrivileges[permGroupKey].system[feature] = actions
      } else {
        const ns = namespace.split(".").join("_DOT_")
        formPrivileges[permGroupKey].namespaces[ns] = actions
      }
    })
  })

  return formPrivileges
}
