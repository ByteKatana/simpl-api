import "@testing-library/jest-dom"
import { PermissionGroup } from "../../interfaces"
import { PermissionGroupController } from "../../controllers/permission-group.controller"
import { Collection, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb"
import { connectDB } from "../../lib/mongodb"

// Mock the mongodb module
jest.mock("../../lib/mongodb", () => ({
  connectDB: jest.fn()
}))

describe("Check if the permission group controller handles actions properly", () => {
  let permissionGroupController: PermissionGroupController
  let permGroupData: PermissionGroup
  let permGroupId: string

  // Mock MongoDB client, collection and operations
  const mockInsertOne = jest.fn()
  const mockUpdateOne = jest.fn()
  const mockDeleteOne = jest.fn()
  const mockCollection = jest.fn(() => ({
    insertOne: mockInsertOne,
    updateOne: mockUpdateOne,
    deleteOne: mockDeleteOne
  }))
  const mockDb = jest.fn(() => ({
    collection: mockCollection
  }))
  const mockClient = {
    db: mockDb,
    close: jest.fn()
  }

  beforeAll(() => {
    // Setup mock return values for MongoDB operations
    const mockObjectId = new ObjectId()
    permGroupId = mockObjectId.toString()

    // Setup connectDB mock
    ;(connectDB as jest.Mock).mockResolvedValue(mockClient)

    // Setup insertOne mock
    mockInsertOne.mockResolvedValue({
      acknowledged: true,
      insertedId: mockObjectId
    } as InsertOneResult)

    // Setup updateOne mock
    mockUpdateOne.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null
    } as UpdateResult)

    // Setup deleteOne mock
    mockDeleteOne.mockResolvedValue({
      acknowledged: true,
      deletedCount: 1
    })
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
    
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const createPermGroup = await permissionGroupController.create()

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("permission_groups")
    
    // Assert insertOne was called with the right data
    expect(mockInsertOne).toHaveBeenCalledWith(permGroupData)
    
    // Assert the returned result
    expect(createPermGroup.result).toEqual({ status: "success", message: "Permission group has been created." })
    expect(createPermGroup.permGroupId).toBeDefined()
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if permission group updated properly", async () => {
    permGroupData = {
      name: "editors1",
      slug: "editors1",
      privileges: []
    }
    
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const updatePermGroup = await permissionGroupController.update(permGroupId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("permission_groups")
    
    // Assert updateOne was called with the right data
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      { $set: permGroupData },
      { upsert: false }
    )
    
    // Assert the returned result
    expect(updatePermGroup).toEqual({ status: "success", message: "Permission group has been updated." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if permission group deleted properly", async () => {
    permGroupData = {
      name: "editors1",
      slug: "editors1",
      privileges: []
    }
    
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const deletePermGroup = await permissionGroupController.delete(permGroupId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("permission_groups")
    
    // Assert deleteOne was called with the right data
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) })
    
    // Assert the returned result
    expect(deletePermGroup).toEqual({ status: "success", message: "Permission group has been deleted." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })
})