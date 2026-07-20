//Database
import { prisma } from "@/lib/prisma"
import { EntryType as PrismaEntryType, PermissionGroup, Prisma } from "@/prisma-client/client"

//Interface
import { EntryType } from "@/interfaces/entry_type"

//===============================================

export class EntryTypeController {
  entryType: EntryType
  mockClient: boolean

  constructor(entryTypeData: EntryType, mockClient: boolean) {
    this.entryType = entryTypeData
    this.mockClient = mockClient
  }

  async create() {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }

    if (client && isConnected) {
      let insertResult: PrismaEntryType | undefined
      let addPrivileges: PermissionGroup | undefined
      try {
        insertResult = await prisma.entryType.create({
          data: {
            createdBy: this.entryType.createdBy,
            created_at: this.entryType.created_at ? new Date(this.entryType.created_at).toISOString() : undefined,
            fieldsets: this.entryType.fieldsets as any,
            name: this.entryType.name,
            namespace: this.entryType.namespace,
            slug: this.entryType.slug,
            status: this.entryType.status,
            updated_at: this.entryType.updated_at ? new Date(this.entryType.updated_at).toISOString() : undefined
          }
        })

        //add CRUD privileges to the user's permission group for this entry type
        const permGroupData = await prisma.permissionGroup.findFirst({
          where: { slug: this.entryType.createdBy }
        })

        if (permGroupData && permGroupData.privileges) {
          const privileges = permGroupData.privileges as any[]
          privileges.push({
            [this.entryType.namespace.split(" ").join("-").toLowerCase()]: {
              permissions: ["read", "update", "delete", "create"]
            }
          })
          addPrivileges = await prisma.permissionGroup.update({
            where: { id: permGroupData.id },
            data: {
              privileges: privileges
            }
          })
        }
        if (insertResult && insertResult.id && addPrivileges) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Entry Type has been created." },
              entryTypeId: insertResult.id
            }
          }
          return { status: "success", message: "Entry Type has been created." }
        } else if (insertResult && insertResult.id && !addPrivileges) {
          // Entry type created but permission group not found or updated
          return { status: "failed", message: "Entry type created but failed to update permission group." }
        } else {
          return { status: "failed", message: "Failed to create the entry type." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the entry type." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async update(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let updateResult: PrismaEntryType | undefined
      let addPrivileges: PermissionGroup | undefined
      let isDifferent = false
      try {
        const prevState = await prisma.entryType.findUnique({
          where: { id: id }
        })

        isDifferent =
          prevState !== null &&
          (prevState.name !== this.entryType.name ||
            prevState.namespace !== this.entryType.namespace ||
            prevState.slug !== this.entryType.slug ||
            prevState.status !== this.entryType.status ||
            JSON.stringify(prevState.fieldsets) !== JSON.stringify(this.entryType.fieldsets))

        updateResult = await prisma.entryType.update({
          where: { id: id },
          data: {
            createdBy: this.entryType.createdBy,
            created_at: this.entryType.created_at ? new Date(this.entryType.created_at).toISOString() : undefined,
            fieldsets: this.entryType.fieldsets as any,
            name: this.entryType.name,
            namespace: this.entryType.namespace,
            slug: this.entryType.slug,
            status: this.entryType.status,
            updated_at: this.entryType.updated_at
              ? new Date(this.entryType.updated_at).toISOString()
              : new Date().toISOString()
          }
        })

        if (prevState && prevState.namespace !== this.entryType.namespace) {
          // Use createdBy from prevState if not provided in update payload
          const permGroupSlug = this.entryType.createdBy || prevState.createdBy

          if (permGroupSlug) {
            const permGroupData = await prisma.permissionGroup.findFirst({
              where: { slug: permGroupSlug }
            })

            if (permGroupData && permGroupData.privileges) {
              const privileges = permGroupData.privileges as any[]
              privileges.push({
                [this.entryType.namespace.split(" ").join("-").toLowerCase()]: {
                  permissions: ["read", "update", "delete", "create"]
                }
              })
              addPrivileges = await prisma.permissionGroup.update({
                where: { id: permGroupData.id },
                data: {
                  privileges: privileges
                }
              })
            }
          }
        }
      } catch (e) {
        console.log(e)
      }

      // Check if namespace changed and privileges were updated
      const namespaceChanged = addPrivileges !== undefined

      if (updateResult && addPrivileges && namespaceChanged && isDifferent) {
        return { status: "success", message: "Entry Type has been updated." }
      } else if (updateResult && !namespaceChanged && isDifferent) {
        return { status: "success", message: "Entry Type has been updated." }
      } else if (updateResult && !isDifferent) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the entry type." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async delete(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let deleteResult: Prisma.BatchPayload | undefined
      try {
        deleteResult = await prisma.entryType.deleteMany({
          where: { namespace: id }
        })
      } catch (e) {
        console.log(e)
      }
      if (deleteResult && deleteResult.count >= 1) {
        return { status: "success", message: "Entry Type has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the entry type." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
