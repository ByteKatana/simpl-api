/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import createRouteHandler from "@/pages/api/v1/user/create"
import updateRouteHandler from "@/pages/api/v1/user/update/[slug]"
import deleteRouteHandler from "@/pages/api/v1/user/delete/[slug]"
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import checkPermissionApi from "@/lib/check-permission-api"

// Mock rate limiting to be a direct pass-through to simplify route testing
jest.mock("@/lib/api/rate-limits", () => require("@/__mocks__/lib/api/rate-limits"))

// Mock permission checking API helper to isolate controller validation
jest.mock("@/lib/check-permission-api", () => require("@/__mocks__/lib/check-permission-api"))

// Mock API key controller and utility checks
jest.mock("@/lib/api/utils", () => require("@/__mocks__/lib/api/utils"))
jest.mock("@/controllers/api-key.controller", () => require("@/__mocks__/controllers/api-key.controller"))

// Mock Prisma client operations to run queries completely in-memory
jest.mock("@/lib/prisma")

describe("/api/v1/user/", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock
  const mockUserCreate = prisma.user.create as jest.Mock
  const mockUserUpdate = prisma.user.update as jest.Mock
  const mockUserFindUnique = prisma.user.findUnique as jest.Mock
  const mockUserDeleteMany = prisma.user.deleteMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SECRET_KEY = "test-secret"
  })

  describe("POST /create", () => {
    it("should successfully create the user", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockUserCreate.mockResolvedValue({ id: "mock-user-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/user/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.result.status).toBe("success")
      expect(data.result.message).toBe("User has been created.")
      expect(data.userId).toBe("mock-user-id")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/user/create",
        query: {
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only POST requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/user/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do POST request for this endpoint!")
    })
  })

  describe("PUT /update/[slug]", () => {
    it("should successfully update the user", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockUserFindUnique.mockResolvedValue({
        id: "mock-user-id",
        email: "test@test.com",
        fullname: "Tester",
        password: "password123",
        permission_group: "tester",
        profile_img: "",
        status: "Active",
        username: "tester"
      })
      mockUserUpdate.mockResolvedValue({ id: "mock-user-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/user/update",
        query: {
          slug: "mock-user-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester1",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("success")
      expect(data.message).toBe("User has been updated.")
    })

    it("should return failure message if no changes were made", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      const state = {
        id: "mock-user-id",
        email: "test@test.com",
        fullname: "Tester",
        password: "password123",
        permission_group: "tester",
        profile_img: "",
        status: "Active",
        username: "tester"
      }
      mockUserFindUnique.mockResolvedValue(state)
      mockUserUpdate.mockResolvedValue(state)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/user/update",
        query: {
          slug: "mock-user-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("failed")
      expect(data.message).toBe("You didn't make any change.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/user/update",
        query: {
          slug: "mock-user-id",
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester1",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only PUT requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/user/update",
        query: {
          slug: "mock-user-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          email: "test@test.com",
          fullname: "Tester1",
          password: "password123",
          permission_group: "tester",
          profile_img: "",
          status: "Active",
          username: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do PUT request for this endpoint!")
    })
  })

  describe("DELETE /delete/[slug]", () => {
    it("should successfully delete the user", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockUserDeleteMany.mockResolvedValue({ count: 1 })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/user/delete",
        query: {
          slug: "mock-user-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("success")
      expect(data.message).toBe("User has been deleted.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/user/delete",
        query: {
          slug: "mock-user-id",
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only DELETE requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/user/delete",
        query: {
          slug: "mock-user-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do DELETE request for this endpoint!")
    })
  })
})
