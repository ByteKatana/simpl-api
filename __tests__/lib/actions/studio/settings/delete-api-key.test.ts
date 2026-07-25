import deleteApiKey from "@/lib/actions/studio/settings/delete-api-key"
import { getPermissionGroup } from "@/lib/auth/get-session"
import handleError from "@/lib/handlers/error"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("@/lib/auth/get-session", () => ({
  getPermissionGroup: jest.fn()
}))
jest.mock("@/lib/handlers/error", () => ({
  __esModule: true,
  default: jest.fn()
}))
jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}))

describe("deleteApiKey", () => {
  const mockGetPermissionGroup = getPermissionGroup as jest.Mock
  const mockHandleError = handleError as unknown as jest.Mock
  const mockRevalidatePath = revalidatePath as jest.Mock
  const mockPrismaApiKeyDelete = prisma.apiKey.delete as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockHandleError.mockImplementation((err: Error) => ({
      success: false,
      error: { message: err.message }
    }))
  })

  it("should delete an api key successfully", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    mockPrismaApiKeyDelete.mockResolvedValue({ id: "1" })

    const result = await deleteApiKey("1")

    expect(result.success).toBe(true)
    expect(prisma.apiKey.delete).toHaveBeenCalledWith({
      where: { id: "1" }
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith("/studio/settings")
  })

  it("should return error if unauthorized", async () => {
    mockGetPermissionGroup.mockResolvedValue(null)

    const result = await deleteApiKey("1")

    expect(result.success).toBe(false)
    if (!result.success && "error" in result) {
        expect(result.error.message).toContain("Unauthorized")
    }
  })

  it("should return error if api key not found", async () => {
    mockGetPermissionGroup.mockResolvedValue({ slug: "admin" })
    // Prisma delete throws if record not found
    mockPrismaApiKeyDelete.mockRejectedValue({ code: "P2025" })

    const result = await deleteApiKey("non-existent")

    expect(result.success).toBe(false)
    expect(mockHandleError).toHaveBeenCalled()
  })
})
