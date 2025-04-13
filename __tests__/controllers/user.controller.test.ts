import "@testing-library/jest-dom"
import { UserController } from "../../controllers/user.controller"
import { User } from "../../interfaces"

describe("Check if user controller handles action properly", () => {
  let userController: UserController
  let userData: User
  let userId: string

  afterAll(() => {
    jest.clearAllMocks()
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

    expect(createUser.result).toEqual({ status: "success", message: "User has been created." })
    userId = createUser.userId
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

    expect(updateUser).toEqual({ status: "success", message: "User has been updated." })
  })
  it("Check if user deleted properly", async () => {
    userData = {
      username: "mock_user2",
      password: "super.strong.password.1111",
      email: "mock_user2@localhost.test",
      permission_group: "member"
    }
    userController = new UserController(userData, true)
    const updateUser = await userController.delete(userId)

    expect(updateUser).toEqual({ status: "success", message: "User has been deleted." })
  })
})
