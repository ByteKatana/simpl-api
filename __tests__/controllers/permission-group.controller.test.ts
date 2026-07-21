import "@testing-library/jest-dom"
import { PermissionGroup } from "@/interfaces"
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"
// Mock the prisma module
jest.mock("@/lib/prisma")

describe("Check if the permission group controller handles actions properly", () => {
  let permissionGroupController: PermissionGroupController
  let permGroupData: PermissionGroup
  let permGroupId: string

  const mockPrismaPermissionGroupCreate = prisma.permissionGroup.create as jest.Mock
  const mockPrismaPermissionGroupFindUnique = prisma.permissionGroup.findUnique as jest.Mock
  const mockPrismaPermissionGroupUpdate = prisma.permissionGroup.update as jest.Mock
  const mockPrismaPermissionGroupDeleteMany = prisma.permissionGroup.deleteMany as jest.Mock

  beforeEach(() => {
    permGroupId = new ObjectId().toString()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Check if permission group created properly", async () => {
    permGroupData = {
      name: "editors",
      slug: "editors",
      privileges: []
    }

    // Setup mock return values for Prisma operations
    mockPrismaPermissionGroupCreate.mockResolvedValue({
      id: permGroupId,
      ...permGroupData
    })

    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const createPermGroup = (await permissionGroupController.create()) as {
      result: { status: string; message: string }
      permGroupId: string
    }

    // Assert prisma.permissionGroup.create was called with correct data
    expect(mockPrismaPermissionGroupCreate).toHaveBeenCalledWith({
      data: {
        name: permGroupData.name,
        slug: permGroupData.slug,
        privileges: []
      }
    })

    // Assert the returned result
    expect(createPermGroup.result).toEqual({ status: "success", message: "Permission group has been created." })
    expect(createPermGroup.permGroupId).toBe(permGroupId)
  })

  it("Check if permission group updated properly", async () => {
    permGroupData = {
      name: "editors1",
      slug: "editors1",
      privileges: []
    }

    // Setup mock return values for Prisma operations
    mockPrismaPermissionGroupFindUnique.mockResolvedValue({
      id: permGroupId,
      name: "editors",
      slug: "editors",
      privileges: []
    })

    mockPrismaPermissionGroupUpdate.mockResolvedValue({
      id: permGroupId,
      ...permGroupData
    })

    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const updatePermGroup = await permissionGroupController.update(permGroupId)

    // Assert findUnique was called first to check prev state
    expect(mockPrismaPermissionGroupFindUnique).toHaveBeenCalledWith({
      where: { id: permGroupId }
    })

    // Assert update was called with correct parameters
    expect(mockPrismaPermissionGroupUpdate).toHaveBeenCalledWith({
      where: { id: permGroupId },
      data: {
        name: permGroupData.name,
        slug: permGroupData.slug,
        privileges: []
      }
    })

    // Assert the returned result
    expect(updatePermGroup).toEqual({ status: "success", message: "Permission group has been updated." })
  })

  it("Check if permission group update detects no-changes and returns appropriately", async () => {
    permGroupData = {
      name: "editors",
      slug: "editors",
      privileges: []
    }

    mockPrismaPermissionGroupFindUnique.mockResolvedValue({
      id: permGroupId,
      name: "editors",
      slug: "editors",
      privileges: []
    })

    mockPrismaPermissionGroupUpdate.mockResolvedValue({
      id: permGroupId,
      ...permGroupData
    })

    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const updatePermGroup = await permissionGroupController.update(permGroupId)

    // Assert findUnique was called first
    expect(mockPrismaPermissionGroupFindUnique).toHaveBeenCalledWith({
      where: { id: permGroupId }
    })

    // Assert it returned the "You didn't make any change." response
    expect(updatePermGroup).toEqual({ status: "failed", message: "You didn't make any change." })
  })

  it("Check if permission group deleted properly", async () => {
    mockPrismaPermissionGroupDeleteMany.mockResolvedValue({
      count: 1
    })

    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const deletePermGroup = await permissionGroupController.delete(permGroupId)

    // Assert deleteMany was called with id
    expect(mockPrismaPermissionGroupDeleteMany).toHaveBeenCalledWith({
      where: { id: permGroupId }
    })

    // Assert the returned result
    expect(deletePermGroup).toEqual({ status: "success", message: "Permission group has been deleted." })
  })
})
