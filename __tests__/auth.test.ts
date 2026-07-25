import { config } from "@/auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import createUser from "@/lib/actions/studio/users/create-user"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import updateUser from "@/lib/actions/studio/users/update-user"
import { UserStatus } from "@/interfaces"

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock("next-auth", () => jest.fn(() => ({
  handlers: { GET: jest.fn(), POST: jest.fn() },
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn()
})))

jest.mock("next-auth/providers/credentials", () => jest.fn((options) => ({ ...options, id: "credentials", name: "credentials" })))
jest.mock("next-auth/providers/github", () => jest.fn((options) => ({ ...options, id: "github", name: "GitHub" })))
jest.mock("next-auth/providers/google", () => jest.fn((options) => ({ ...options, id: "google", name: "Google" })))
jest.mock("next-auth/providers/gitlab", () => jest.fn((options) => ({ ...options, id: "gitlab", name: "GitLab" })))
jest.mock("next-auth/providers/bitbucket", () => jest.fn((options) => ({ ...options, id: "bitbucket", name: "Bitbucket" })))
jest.mock("next-auth/providers/atlassian", () => jest.fn((options) => ({ ...options, id: "atlassian", name: "Atlassian" })))
jest.mock("next-auth/providers/apple", () => jest.fn((options) => ({ ...options, id: "apple", name: "Apple" })))
jest.mock("next-auth/providers/slack", () => jest.fn((options) => ({ ...options, id: "slack", name: "Slack" })))
jest.mock("next-auth/providers/zoom", () => jest.fn((options) => ({ ...options, id: "zoom", name: "Zoom" })))
jest.mock("next-auth/providers/linkedin", () => jest.fn((options) => ({ ...options, id: "linkedin", name: "LinkedIn" })))
jest.mock("next-auth/providers/click-up", () => jest.fn((options) => ({ ...options, id: "click-up", name: "ClickUp" })))
jest.mock("next-auth/providers/yandex", () => jest.fn((options) => ({ ...options, id: "yandex", name: "Yandex" })))
jest.mock("next-auth/providers/netlify", () => jest.fn((options) => ({ ...options, id: "netlify", name: "Netlify" })))
jest.mock("next-auth/providers/huggingface", () => jest.fn((options) => ({ ...options, id: "huggingface", name: "Huggingface" })))
jest.mock("next-auth/providers/mailru", () => jest.fn((options) => ({ ...options, id: "mailru", name: "Mailru" })))

jest.mock("bcryptjs", () => ({
  compareSync: jest.fn()
}))

jest.mock("@/lib/prisma", () => ({
  prisma: require("@/lib/__mocks__/prisma").prisma
}))

jest.mock("@/lib/actions/studio/users/create-user", () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock("@/lib/actions/studio/settings/get-settings-value", () => ({
  getSettingsValue: jest.fn()
}))

jest.mock("@/lib/actions/studio/users/update-user", () => ({
  __esModule: true,
  default: jest.fn()
}))

describe("auth.ts", () => {
  const mockBcryptCompare = bcrypt.compareSync as jest.Mock
  const mockCreateUser = createUser as unknown as jest.Mock
  const mockGetSettingsValue = getSettingsValue as jest.Mock
  const mockUpdateUser = updateUser as unknown as jest.Mock
  const mockPrismaFindFirst = prisma.user.findFirst as jest.Mock
  const mockPrismaFindMany = prisma.user.findMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.DB_NAME = "test-db"
  })

  describe("CredentialsProvider.authorize", () => {
    const authorize = (config.providers.find((p: any) => p.id === "credentials") as any).authorize

    it("should authorize successfully with correct credentials", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        password: "hashed-password",
        fullname: "Test User",
        username: "testuser",
        permission_group: "admin",
        profile_img: "img.png",
        status: UserStatus.Active
      }

      mockPrismaFindFirst.mockResolvedValue(mockUser)
      mockBcryptCompare.mockReturnValue(true)

      const result = await authorize({ email: "test@example.com", password: "password" })

      expect(result).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        username: "testuser",
        permission_group: "admin",
        profile_img: "img.png",
        status: UserStatus.Active,
        email_verified: true
      })
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com" }
      })
    })

    it("should return null if user not found", async () => {
      mockPrismaFindFirst.mockResolvedValue(null)

      const result = await authorize({ email: "wrong@example.com", password: "password" })

      expect(result).toBeNull()
    })

    it("should return null if password incorrect", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@example.com",
        password: "hashed-password"
      }

      mockPrismaFindFirst.mockResolvedValue(mockUser)
      mockBcryptCompare.mockReturnValue(false)

      const result = await authorize({ email: "test@example.com", password: "wrong-password" })

      expect(result).toBeNull()
    })
  })

  describe("signIn callback", () => {
    const signIn = config.callbacks.signIn as any

    it("should return true for credentials provider if user is active", async () => {
      const result = await signIn({ user: { status: UserStatus.Active }, account: { provider: "credentials" } })
      expect(result).toBe(true)
    })

    it("should return false if user is disabled", async () => {
      const result = await signIn({ user: { status: UserStatus.Disabled }, account: { provider: "credentials" } })
      expect(result).toBe(false)
    })

    describe("OAuth", () => {
      const oauthAccount = { provider: "github", providerAccountId: "oauth-123" }
      const oauthProfile = { email: "oauth@example.com", name: "OAuth User", login: "oauthuser" }

      it("should create a new user if not found and email verified", async () => {
        mockPrismaFindMany.mockResolvedValue([])
        mockGetSettingsValue.mockResolvedValue("viewer")
        mockCreateUser.mockResolvedValue({ success: true })

        const userObj: any = { email: "oauth@example.com", name: "OAuth User" }
        const result = await signIn({
          user: userObj,
          account: oauthAccount,
          profile: { ...oauthProfile, email_verified: true }
        })

        expect(result).toBe(true)
        expect(mockCreateUser).toHaveBeenCalled()
        expect(userObj.permission_group).toBe("viewer")
      })

      it("should link account if user found by email but no oauth_id", async () => {
        const dbUser = {
          id: "existing-id",
          email: "oauth@example.com",
          fullname: "Existing User",
          username: "existing",
          status: UserStatus.Active,
          permission_group: "admin"
        }

        mockPrismaFindMany.mockImplementation((params) => {
          if (params.where.email) return Promise.resolve([dbUser])
          return Promise.resolve([])
        })

        mockUpdateUser.mockResolvedValue({ success: true })

        const userObj: any = { email: "oauth@example.com", name: "Existing User" }
        const result = await signIn({
          user: userObj,
          account: oauthAccount,
          profile: oauthProfile
        })

        expect(result).toBe(true)
        expect(mockUpdateUser).toHaveBeenCalled()
        expect(userObj.id).toBe("existing-id")
      })
    })
  })

  describe("jwt callback", () => {
    const jwt = config.callbacks.jwt as any

    it("should populate token with user data on initial sign in", () => {
      const user = {
        id: "u1",
        username: "user1",
        permission_group: "admin",
        profile_img: "img.png",
        status: "active"
      }
      const token = {}
      const result = jwt({ token, user })
      expect(result).toEqual({
        id: "u1",
        username: "user1",
        permission_group: "admin",
        profile_img: "img.png",
        status: "active"
      })
    })

    it("should return token as is if no user provided", () => {
      const token = { id: "u1" }
      const result = jwt({ token })
      expect(result).toEqual(token)
    })
  })

  describe("session callback", () => {
    const sessionCallback = config.callbacks.session as any

    it("should map token data to session", () => {
      const session = { user: {} }
      const token = {
        id: "u1",
        username: "user1",
        permission_group: "admin",
        profile_img: "img.png",
        status: "active"
      }
      const result = sessionCallback({ session, token })
      expect(result.id).toBe("u1")
      expect(result.user.username).toBe("user1")
      expect(result.user.permission_group).toBe("admin")
      expect(result.user.profile_img).toBe("img.png")
      expect(result.user.status).toBe("active")
    })
  })
})
