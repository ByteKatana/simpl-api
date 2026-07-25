import { runSetupAction } from "@/app/setup/setup-action"
import { UserController } from "@/controllers/user.controller"
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { exec } from "child_process"
import { UserStatus } from "@/interfaces"

jest.mock("child_process", () => ({
  exec: jest.fn()
}))

jest.mock("@/controllers/user.controller")
jest.mock("@/controllers/permission-group.controller")
jest.mock("@/controllers/api-key.controller")

jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn((err) => ({
    success: false,
    error: { message: err.message }
  }))
}))

describe("runSetupAction", () => {
  const mockValues = {
    ADMIN_FULLNAME: "Admin User",
    ADMIN_USERNAME: "admin",
    ADMIN_EMAIL: "admin@example.com",
    ADMIN_PASSWORD: "password123"
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(exec as unknown as jest.Mock).mockImplementation((_cmd, cb) => cb(null, { stdout: "", stderr: "" }))
  })

  it("should successfully run setup", async () => {
    // Mock successful controller operations
    ;(UserController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })
    ;(PermissionGroupController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })
    ;(apiKeyController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })

    const result = await runSetupAction(mockValues)

    expect(result.success).toBe(true)
    expect(result.data?.adminAccount.username).toBe("admin")
    expect(result.data?.apiKey).toBeDefined()

    expect(UserController).toHaveBeenCalledWith(
      expect.objectContaining({
        fullname: "Admin User",
        username: "admin",
        email: "admin@example.com",
        permission_group: "root",
        status: UserStatus.Active
      }),
      false
    )

    expect(PermissionGroupController).toHaveBeenCalledTimes(3) // root, admin, viewer
    expect(apiKeyController).toHaveBeenCalled()
    expect(exec).toHaveBeenCalledWith("npx prisma db push", expect.any(Function))
    expect(exec).toHaveBeenCalledWith("npx prisma db seed", expect.any(Function))
  })

  it("should return error if admin creation fails", async () => {
    ;(UserController.prototype.create as jest.Mock).mockResolvedValue({ status: "failed" })

    const result = await runSetupAction(mockValues)

    expect(result.success).toBe(false)
    expect(result.error?.message).toBe("Admin creation failed")
  })

  it("should return error if permission group creation fails", async () => {
    ;(UserController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })
    ;(PermissionGroupController.prototype.create as jest.Mock).mockResolvedValue({ status: "failed" })

    const result = await runSetupAction(mockValues)

    expect(result.success).toBe(false)
    expect(result.error?.message).toBe("Permission groups creation failed")
  })

  it("should return error if API key generation fails", async () => {
    ;(UserController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })
    ;(PermissionGroupController.prototype.create as jest.Mock).mockResolvedValue({ status: "success" })
    ;(apiKeyController.prototype.create as jest.Mock).mockResolvedValue({ status: "failed" })

    const result = await runSetupAction(mockValues)

    expect(result.success).toBe(false)
    expect(result.error?.message).toBe("Failed to generate API key")
  })

  it("should catch unexpected errors and return generic error message", async () => {
    ;(UserController.prototype.create as jest.Mock).mockRejectedValue(new Error("Unexpected"))

    const result = await runSetupAction(mockValues)

    expect(result.success).toBe(false)
    expect(result.error?.message).toBe("Something went wrong")
  })
})
