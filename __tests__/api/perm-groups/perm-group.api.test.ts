/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import createRouteHandler from "@/pages/api/v1/permission-group/create"
import updateRouteHandler from "@/pages/api/v1/permission-group/update/[slug]"
import deleteRouteHandler from "@/pages/api/v1/permission-group/delete/[slug]"
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

describe("/api/v1/permission-group/", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock
  const mockPermGroupCreate = prisma.permissionGroup.create as jest.Mock
  const mockPermGroupUpdate = prisma.permissionGroup.update as jest.Mock
  const mockPermGroupFindUnique = prisma.permissionGroup.findUnique as jest.Mock
  const mockPermGroupDeleteMany = prisma.permissionGroup.deleteMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SECRET_KEY = "test-secret"
  })

  describe("POST /create", () => {
    it("should create the permission group", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockPermGroupCreate.mockResolvedValue({ id: "mock-perm-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/permission-group/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.result.status).toBe("success")
      expect(data.result.message).toBe("Permission group has been created.")
      expect(data.permGroupId).toBe("mock-perm-id")
    })

    it("should return 'only POST request' message", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/permission-group/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do POST request for this endpoint!")
    })

    it("should return 'You're not authorized!' message if there is no API key or secret key", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/permission-group/create",
        query: {
          apikey: "invalid",
          secretkey: "wrong-secret",
          mockclient: "true"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })
  })

  describe("PUT /update/[slug]", () => {
    it("should update the permission group", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockPermGroupFindUnique.mockResolvedValue({
        id: "mock-perm-id",
        name: "Tester",
        slug: "tester",
        privileges: []
      })
      mockPermGroupUpdate.mockResolvedValue({ id: "mock-perm-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/permission-group/update",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        },
        body: {
          name: "Tester1",
          privileges: [
            {
              products: {
                permissions: ["read", "create", "update", "delete"]
              }
            }
          ],
          slug: "tester1"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("success")
      expect(data.message).toBe("Permission group has been updated.")
    })

    it("should return 'failed' if no change is made", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      const state = {
        id: "mock-perm-id",
        name: "Tester",
        slug: "tester",
        privileges: []
      }
      mockPermGroupFindUnique.mockResolvedValue(state)
      mockPermGroupUpdate.mockResolvedValue(state)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/permission-group/update",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("failed")
      expect(data.message).toBe("You didn't make any change.")
    })

    it("should return 'only PUT request' message", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/permission-group/update",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do PUT request for this endpoint!")
    })

    it("should return 'You're not authorized!' message if there is no API key or secret key", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/permission-group/update",
        query: {
          apikey: "invalid",
          secretkey: "wrong-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        },
        body: {
          name: "Tester",
          privileges: [],
          slug: "tester"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })
  })

  describe("DELETE /delete/[slug]", () => {
    it("should delete the permission group", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockPermGroupDeleteMany.mockResolvedValue({ count: 1 })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/permission-group/delete",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.status).toBe("success")
      expect(data.message).toBe("Permission group has been deleted.")
    })

    it("should return 'only DELETE request' message", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/permission-group/delete",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(200)
      expect(data.message).toBe("You can only do DELETE request for this endpoint!")
    })

    it("should return 'You're not authorized!' message if there is no API key or secret key", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/permission-group/delete",
        query: {
          apikey: "invalid",
          secretkey: "wrong-secret",
          mockclient: "true",
          slug: "mock-perm-id"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)
      const data = await response._getJSONData()

      expect(response._getStatusCode()).toBe(401)
      expect(data.message).toBe("You're not authorized!")
    })
  })
})
