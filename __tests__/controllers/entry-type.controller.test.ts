import "@testing-library/jest-dom"
import { EntryType } from "../../interfaces"
import { EntryTypeController } from "../../controllers/entry-type.controller"
import { Collection, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb"
import { connectDB } from "../../lib/mongodb"

// Mock the mongodb module
jest.mock("../../lib/mongodb", () => ({
  connectDB: jest.fn()
}))

describe("Check if the entry type controller handles actions properly", () => {
  let entryTypeController: EntryTypeController
  let entryTypeData: EntryType
  let entryTypeId: string

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
    entryTypeId = mockObjectId.toString()

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

  it("Check if entry type created properly", async () => {
    entryTypeData = {
      name: "mock type",
      namespace: "mock-type",
      fields: []
    }
    
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const createEntryType = await entryTypeController.create()

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entry_types")
    
    // Assert insertOne was called with the right data
    expect(mockInsertOne).toHaveBeenCalledWith(entryTypeData)
    
    // Assert the returned result
    expect(createEntryType.result).toEqual({ status: "success", message: "Entry Type has been created." })
    expect(createEntryType.entryTypeId).toBeDefined()
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if entry type updated properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      fields: []
    }
    
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const updateEntryType = await entryTypeController.update(entryTypeId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entry_types")
    
    // Assert updateOne was called with the right data
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      { $set: entryTypeData },
      { upsert: false }
    )
    
    // Assert the returned result
    expect(updateEntryType).toEqual({ status: "success", message: "Entry Type has been updated." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if entry type deleted properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      fields: []
    }
    
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const deleteEntryType = await entryTypeController.delete(entryTypeId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entry_types")
    
    // Assert deleteOne was called with the right data
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) })
    
    // Assert the returned result
    expect(deleteEntryType).toEqual({ status: "success", message: "Entry Type has been deleted." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })
})