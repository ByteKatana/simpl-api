//Database
import { prisma } from "@/lib/prisma"
import { PermissionGroup as PrismaPermissionGroup } from "@/prisma-client/client"

//Interface
import { PermissionGroup } from "@/interfaces/permission_group"

//===============================================

export class PermissionGroupController {
  permissionGroup: PermissionGroup
  mockClient: boolean

  constructor(permissionGroupData: PermissionGroup, mockClient: boolean) {
    this.permissionGroup = permissionGroupData
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
      let insertResult: PrismaPermissionGroup | undefined
      try {
        insertResult = await prisma.permissionGroup.create({
          data: {
            name: this.permissionGroup.name,
            slug: this.permissionGroup.slug,
            privileges: this.permissionGroup.privileges as any
          }
        })

        if (insertResult && insertResult.id) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Permission group has been created." },
              permGroupId: insertResult.id
            }
          }

          return { status: "success", message: "Permission group has been created." }
        } else {
          return { status: "failed", message: "Failed to create the permission group." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the permission group." }
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
      let updateResult: PrismaPermissionGroup | undefined
      let isDifferent = false
      try {
        const prevState = await prisma.permissionGroup.findUnique({
          where: { id: id }
        })

        isDifferent =
          prevState !== null &&
          (prevState.name !== this.permissionGroup.name ||
            prevState.slug !== this.permissionGroup.slug ||
            JSON.stringify(prevState.privileges) !== JSON.stringify(this.permissionGroup.privileges))

        updateResult = await prisma.permissionGroup.update({
          where: { id: id },
          data: {
            name: this.permissionGroup.name,
            slug: this.permissionGroup.slug,
            privileges: this.permissionGroup.privileges as any
          }
        })
      } catch (e) {
        console.log(e)
      }

      if (updateResult && isDifferent) {
        return { status: "success", message: "Permission group has been updated." }
      } else if (updateResult && !isDifferent) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the permission group." }
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
      let deleteResult: { count: number } | undefined
      try {
        deleteResult = await prisma.permissionGroup.deleteMany({
          where: { id: id }
        })
      } catch (e) {
        console.log(e)
      }
      if (deleteResult && deleteResult.count >= 1) {
        return { status: "success", message: "Permission group has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the permission group." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
