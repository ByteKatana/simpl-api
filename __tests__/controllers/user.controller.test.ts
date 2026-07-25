import "@testing-library/jest-dom"
import { UserController } from "@/controllers/user.controller"
import { UserStatus } from "@/interfaces"
import { User } from "@/interfaces/user"
import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

// Mock the prisma module
jest.mock("@/lib/prisma")

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hashSync: jest.fn().mockReturnValue("hashed_password")
}))

describe("Check if the user controller handles actions properly", () => {
  let userController: UserController
  let userData: User
  let userId: string

  const mockPrismaUserCreate = prisma.user.create as jest.Mock
  const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock
  const mockPrismaUserUpdate = prisma.user.update as jest.Mock
  const mockPrismaUserDeleteMany = prisma.user.deleteMany as jest.Mock

  beforeEach(() => {
    userId = new ObjectId().toString()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Check if user created properly", async () => {
    const createDate = new Date().toISOString(),
    userData = {
      username: "mock_user",
      password: "super.strong.password.1111",
      email: "mock_user@localhost.test",
      permission_group: "member",
      fullname: "Mock User",
      status: UserStatus.Active,
      profile_img: "",
      oauth_id: "oauth123",
      oauth_provider: "github",
      created_at: createDate,
      created_by: "system",
      updated_at: createDate,
      updated_by: "system",
      email_verified: false
    }

    mockPrismaUserCreate.mockResolvedValue({
      id: userId,
      ...userData,
      password: "hashed_password"
    })

    userController = new UserController(userData, true)
    const createUser = (await userController.create()) as {
      result: { status: string; message: string }
      userId: string
    }

    // Assert bcrypt.hashSync was called with the password
    expect(bcrypt.hashSync).toHaveBeenCalledWith(userData.password, 8)

    // Assert prisma.user.create was called with the right data
    expect(mockPrismaUserCreate).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        fullname: userData.fullname,
        password: "hashed_password",
        permission_group: userData.permission_group,
        profile_img: "",
        status: userData.status,
        username: userData.username,
        email_verified: false,
        oauth_id: "oauth123",
        oauth_provider: "github",
        created_at: createDate,
        created_by: "system",
        updated_at: createDate,
        updated_by: "system"
      }
    })

    // Assert the returned result
    expect(createUser.result).toEqual({ status: "success", message: "User has been created." })
    expect(createUser.userId).toBe(userId)
  })

  it("Check if user updated properly", async () => {
    userData = {
      username: "mock_user2",
      password: "super.strong.password.1111",
      email: "mock_user2@localhost.test",
      permission_group: "viewer",
      fullname: "Mock User 2",
      status: UserStatus.Active,
      profile_img: "",
      created_at: new Date().toISOString(),
      created_by: "system",
      updated_at: new Date().toISOString(),
      updated_by: "system",
      email_verified: false
    }

    mockPrismaUserFindUnique.mockResolvedValue({
      id: userId,
      username: "mock_user",
      email: "mock_user@localhost.test",
      permission_group: "viewer",
      fullname: "Mock User",
      status: UserStatus.Active,
      profile_img: "",
      password: "hashed_password"
    })

    mockPrismaUserUpdate.mockResolvedValue({
      id: userId,
      ...userData
    })

    userController = new UserController(userData, true)
    const updateUser = await userController.update(userId)

    // Assert findUnique was called
    expect(mockPrismaUserFindUnique).toHaveBeenCalledWith({
      where: { id: userId }
    })

    // Assert update was called with the right data and ID
    expect(mockPrismaUserUpdate).toHaveBeenCalledWith({
      where: { id: userId },
      data: expect.objectContaining({
        username: userData.username,
        email: userData.email,
        permission_group: userData.permission_group,
        fullname: userData.fullname,
        status: userData.status,
        profile_img: ""
      })
    })

    // Assert the returned result
    expect(updateUser).toEqual({ status: "success", message: "User has been updated." })
  })

  it("Check if user update detects no-changes and returns appropriately", async () => {
    userData = {
      username: "mock_user",
      password: "hashed_password",
      email: "mock_user@localhost.test",
      permission_group: "viewer",
      fullname: "Mock User",
      status: UserStatus.Active,
      profile_img: "",
      created_at: new Date().toISOString(),
      created_by: "system",
      updated_at: new Date().toISOString(),
      updated_by: "system",
      email_verified: false
    }

    mockPrismaUserFindUnique.mockResolvedValue({
      id: userId,
      ...userData
    })

    mockPrismaUserUpdate.mockResolvedValue({
      id: userId,
      ...userData
    })

    userController = new UserController(userData, true)
    const updateUser = await userController.update(userId)

    expect(updateUser).toEqual({ status: "failed", message: "You didn't make any change." })
  })

  it("Check if user deleted properly", async () => {
    mockPrismaUserDeleteMany.mockResolvedValue({
      count: 1
    })

    userController = new UserController({} as any, true)
    const deleteUser = await userController.delete(userId)

    // Assert deleteMany was called with the right ID
    expect(mockPrismaUserDeleteMany).toHaveBeenCalledWith({
      where: { id: userId }
    })

    // Assert the returned result
    expect(deleteUser).toEqual({ status: "success", message: "User has been deleted." })
  })
})
