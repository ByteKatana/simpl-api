import "@testing-library/jest-dom"
import { EntryType, PublishStatus } from "@/interfaces"
import { EntryTypeController } from "@/controllers/entry-type.controller"
import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"

// Mock the prisma module
jest.mock("@/lib/prisma")

describe("Check if the entry type controller handles actions properly", () => {
  let entryTypeController: EntryTypeController
  let entryTypeData: EntryType
  let entryTypeId: string

  const mockPrismaEntryTypeCreate = prisma.entryType.create as jest.Mock
  const mockPrismaEntryTypeFindUnique = prisma.entryType.findUnique as jest.Mock
  const mockPrismaEntryTypeUpdate = prisma.entryType.update as jest.Mock
  const mockPrismaEntryTypeDeleteMany = prisma.entryType.deleteMany as jest.Mock
  const mockPrismaPermissionGroupFindFirst = prisma.permissionGroup.findFirst as jest.Mock
  const mockPrismaPermissionGroupUpdate = prisma.permissionGroup.update as jest.Mock

  beforeEach(() => {
    entryTypeId = new ObjectId().toString()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Check if entry type created properly", async () => {
    entryTypeData = {
      name: "mock type",
      namespace: "mock-type",
      slug: "mock-type",
      createdBy: "mock-user",
      created_at: new Date(),
      updated_at: new Date(),
      status: PublishStatus.Draft,
      fieldsets: []
    }

    // Setup mock return values for Prisma operations
    mockPrismaEntryTypeCreate.mockResolvedValue({
      id: entryTypeId,
      ...entryTypeData,
      created_at: entryTypeData.created_at?.toISOString(),
      updated_at: entryTypeData.updated_at?.toISOString()
    })

    mockPrismaPermissionGroupFindFirst.mockResolvedValue({
      id: "perm-group-id",
      slug: "mock-user",
      privileges: []
    })

    mockPrismaPermissionGroupUpdate.mockResolvedValue({
      id: "perm-group-id",
      slug: "mock-user",
      privileges: [
        {
          "mock-type": {
            permissions: ["read", "update", "delete", "create"]
          }
        }
      ]
    })

    entryTypeController = new EntryTypeController(entryTypeData, true)
    const createEntryType = (await entryTypeController.create()) as {
      result: { status: string; message: string }
      entryTypeId: string
    }

    // Assert prisma.entryType.create was called with correct data
    expect(mockPrismaEntryTypeCreate).toHaveBeenCalledWith({
      data: {
        createdBy: entryTypeData.createdBy,
        created_at: entryTypeData.created_at?.toISOString(),
        fieldsets: [],
        name: entryTypeData.name,
        namespace: entryTypeData.namespace,
        slug: entryTypeData.slug,
        status: entryTypeData.status,
        updated_at: entryTypeData.updated_at?.toISOString()
      }
    })

    // Assert permission check and updates
    expect(mockPrismaPermissionGroupFindFirst).toHaveBeenCalledWith({
      where: { slug: entryTypeData.createdBy }
    })

    expect(mockPrismaPermissionGroupUpdate).toHaveBeenCalledWith({
      where: { id: "perm-group-id" },
      data: {
        privileges: [
          {
            "mock-type": {
              permissions: ["read", "update", "delete", "create"]
            }
          }
        ]
      }
    })

    // Assert the returned result
    expect(createEntryType.result).toEqual({ status: "success", message: "Entry Type has been created." })
    expect(createEntryType.entryTypeId).toBe(entryTypeId)
  })

  it("Check if entry type updated properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      slug: "mock-type1",
      createdBy: "mock-user",
      created_at: new Date(),
      updated_at: new Date(),
      status: PublishStatus.Draft,
      fieldsets: []
    }

    // Setup mock return values for Prisma operations
    mockPrismaEntryTypeFindUnique.mockResolvedValue({
      id: entryTypeId,
      name: "mock type",
      namespace: "mock-type",
      slug: "mock-type",
      createdBy: "mock-user",
      created_at: entryTypeData.created_at?.toISOString(),
      updated_at: entryTypeData.updated_at?.toISOString()
    })

    mockPrismaEntryTypeUpdate.mockResolvedValue({
      id: entryTypeId,
      ...entryTypeData,
      created_at: entryTypeData.created_at?.toISOString(),
      updated_at: entryTypeData.updated_at?.toISOString()
    })

    mockPrismaPermissionGroupFindFirst.mockResolvedValue({
      id: "perm-group-id",
      slug: "mock-user",
      privileges: []
    })

    mockPrismaPermissionGroupUpdate.mockResolvedValue({
      id: "perm-group-id",
      slug: "mock-user",
      privileges: [
        {
          "mock-type1": {
            permissions: ["read", "update", "delete", "create"]
          }
        }
      ]
    })

    entryTypeController = new EntryTypeController(entryTypeData, true)
    const updateEntryType = await entryTypeController.update(entryTypeId)

    // Assert findUnique was called first to check prev state
    expect(mockPrismaEntryTypeFindUnique).toHaveBeenCalledWith({
      where: { id: entryTypeId }
    })

    // Assert update was called with correct parameters
    expect(mockPrismaEntryTypeUpdate).toHaveBeenCalledWith({
      where: { id: entryTypeId },
      data: {
        createdBy: entryTypeData.createdBy,
        created_at: entryTypeData.created_at?.toISOString(),
        fieldsets: [],
        name: entryTypeData.name,
        namespace: entryTypeData.namespace,
        slug: entryTypeData.slug,
        status: entryTypeData.status,
        updated_at: entryTypeData.updated_at?.toISOString()
      }
    })

    // Assert permission group search & update since namespace changed from mock-type to mock-type1
    expect(mockPrismaPermissionGroupFindFirst).toHaveBeenCalledWith({
      where: { slug: "mock-user" }
    })

    expect(mockPrismaPermissionGroupUpdate).toHaveBeenCalledWith({
      where: { id: "perm-group-id" },
      data: {
        privileges: [
          {
            "mock-type1": {
              permissions: ["read", "update", "delete", "create"]
            }
          }
        ]
      }
    })

    // Assert the returned result
    expect(updateEntryType).toEqual({ status: "success", message: "Entry Type has been updated." })
  })

  it("Check if entry type update detects no-changes and returns appropriately", async () => {
    entryTypeData = {
      name: "mock type",
      namespace: "mock-type",
      slug: "mock-type",
      createdBy: "mock-user",
      created_at: new Date(),
      updated_at: new Date(),
      status: PublishStatus.Draft,
      fieldsets: []
    }

    mockPrismaEntryTypeFindUnique.mockResolvedValue({
      id: entryTypeId,
      name: "mock type",
      namespace: "mock-type",
      slug: "mock-type",
      createdBy: "mock-user",
      status: "Draft",
      fieldsets: [],
      created_at: entryTypeData.created_at?.toISOString(),
      updated_at: entryTypeData.updated_at?.toISOString()
    })

    mockPrismaEntryTypeUpdate.mockResolvedValue({
      id: entryTypeId,
      ...entryTypeData,
      created_at: entryTypeData.created_at?.toISOString(),
      updated_at: entryTypeData.updated_at?.toISOString()
    })

    entryTypeController = new EntryTypeController(entryTypeData, true)
    const updateEntryType = await entryTypeController.update(entryTypeId)

    // Assert findUnique was called first
    expect(mockPrismaEntryTypeFindUnique).toHaveBeenCalledWith({
      where: { id: entryTypeId }
    })

    // Assert update was called with same data
    expect(mockPrismaEntryTypeUpdate).toHaveBeenCalled()

    // Assert that we did not attempt to modify privileges since namespace did not change
    expect(mockPrismaPermissionGroupFindFirst).not.toHaveBeenCalled()

    // Assert it returned the "You didn't make any change." response
    expect(updateEntryType).toEqual({ status: "failed", message: "You didn't make any change." })
  })

  it("Check if entry type deleted properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      slug: "mock-type1",
      createdBy: "mock-user",
      created_at: new Date(),
      updated_at: new Date(),
      status: PublishStatus.Draft,
      fieldsets: []
    }

    mockPrismaEntryTypeDeleteMany.mockResolvedValue({
      count: 1
    })

    entryTypeController = new EntryTypeController(entryTypeData, true)
    const deleteEntryType = await entryTypeController.delete(entryTypeId)

    // Assert deleteMany was called with namespace as id
    expect(mockPrismaEntryTypeDeleteMany).toHaveBeenCalledWith({
      where: { namespace: entryTypeId }
    })

    // Assert the returned result
    expect(deleteEntryType).toEqual({ status: "success", message: "Entry Type has been deleted." })
  })
})
