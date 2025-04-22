import "@testing-library/jest-dom"
import { Entry } from "../../interfaces"
import { EntryController } from "../../controllers/entry.controller"
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb"
import { connectDB } from "../../lib/mongodb"

// Mock the mongodb module
jest.mock("../../lib/mongodb", () => ({
  connectDB: jest.fn()
}))

describe("Check if the entry controller handles actions properly", () => {
  let entryController: EntryController
  let entryData: Entry
  let entryId: string
  
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
    entryId = mockObjectId.toString()

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
    } as DeleteResult)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Check if entry created properly", async () => {
    entryData = {
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry"
    }
    
    entryController = new EntryController(entryData, true)
    const createEntry = await entryController.create()

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entries")
    
    // Assert insertOne was called with the right data
    expect(mockInsertOne).toHaveBeenCalledWith(entryData)
    
    // Assert the returned result
    expect(createEntry.result).toEqual({ status: "success", message: "Entry has been created." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if entry updated properly", async () => {
    entryData = {
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1"
    }
    
    entryController = new EntryController(entryData, true)
    const updateEntry = await entryController.update(entryId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entries")
    
    // Assert updateOne was called with the right data
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      { $set: entryData },
      { upsert: false }
    )
    
    // Assert the returned result
    expect(updateEntry).toEqual({ status: "success", message: "Entry has been updated." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if entry deleted properly", async () => {
    entryData = {
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1"
    }
    
    entryController = new EntryController(entryData, true)
    const deleteEntry = await entryController.delete(entryId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)
    
    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("entries")
    
    // Assert deleteOne was called with the right data
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) })
    
    // Assert the returned result
    expect(deleteEntry).toEqual({ status: "success", message: "Entry has been deleted." })
    
    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })
})