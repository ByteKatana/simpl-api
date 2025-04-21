import "@testing-library/jest-dom"
import { UserController } from "../../controllers/user.controller"
import { User } from "../../interfaces"
import { Collection, InsertOneResult, MongoClient, ObjectId, UpdateResult, DeleteResult } from "mongodb"
import { connectDB } from "../../lib/mongodb"
import bcrypt from "bcryptjs"

// Mock the mongodb module
jest.mock("../../lib/mongodb", () => ({
  connectDB: jest.fn()
}))

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hashSync: jest.fn().mockReturnValue("hashed_password")
}))

describe("Check if the user controller handles actions properly", () => {
  let userController: UserController
  let userData: User
  let userId: string

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
    userId = mockObjectId

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

  it("Check if user created properly", async () => {
    userData = {
      username: "mock_user",
      password: "super.strong.password.1111",
      email: "mock_user@localhost.test",
      permission_group: "member"
    }

    userController = new UserController(userData, true)
    const createUser = await userController.create()

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)

    // Assert bcrypt.hashSync was called with the password
    expect(bcrypt.hashSync).toHaveBeenCalledWith(userData.password, 8)

    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("users")

    // Assert insertOne was called with the right data
    expect(mockInsertOne).toHaveBeenCalledWith({
      ...userData,
      password: "hashed_password"
    })

    // Assert the returned result
    expect(createUser.result).toEqual({ status: "success", message: "User has been created." })
    expect(createUser.userId).toBe(userId)

    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if user updated properly", async () => {
    userData = {
      username: "mock_user2",
      password: "super.strong.password.1111",
      email: "mock_user2@localhost.test",
      permission_group: "member"
    }

    userController = new UserController(userData, true)
    const updateUser = await userController.update(userId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)

    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("users")

    // Assert updateOne was called with the right data and ID
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { _id: expect.any(ObjectId) },
      {
        $set: expect.objectContaining({
          username: userData.username,
          email: userData.email,
          permission_group: userData.permission_group
        })
      },
      { upsert: false }
    )

    // Assert the returned result
    expect(updateUser).toEqual({ status: "success", message: "User has been updated." })

    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })

  it("Check if user deleted properly", async () => {
    userData = {
      username: "mock_user2",
      password: "super.strong.password.1111",
      email: "mock_user2@localhost.test",
      permission_group: "member"
    }

    userController = new UserController(userData, true)
    const deleteUser = await userController.delete(userId)

    // Assert connectDB was called
    expect(connectDB).toHaveBeenCalledWith(true)

    // Assert db and collection methods were called
    expect(mockDb).toHaveBeenCalledWith(process.env.DB_NAME)
    expect(mockCollection).toHaveBeenCalledWith("users")

    // Assert deleteOne was called with the right ID
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: expect.any(ObjectId) })

    // Assert the returned result
    expect(deleteUser).toEqual({ status: "success", message: "User has been deleted." })

    // Assert client.close was called
    expect(mockClient.close).toHaveBeenCalled()
  })
})