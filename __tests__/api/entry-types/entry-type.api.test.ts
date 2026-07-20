/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import createRouteHandler from "@/pages/api/v1/entry-type/create"
import updateRouteHandler from "@/pages/api/v1/entry-type/update/[slug]"
import deleteRouteHandler from "@/pages/api/v1/entry-type/delete/[slug]"
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
jest.mock("@/lib/prisma", () => require("@/__mocks__/lib/prisma.mock"))

describe("/api/v1/entry-type/", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock
  const mockEntryTypeCreate = prisma.entryType.create as jest.Mock
  const mockPermissionGroupFindFirst = prisma.permissionGroup.findFirst as jest.Mock
  const mockPermissionGroupUpdate = prisma.permissionGroup.update as jest.Mock
  const mockEntryTypeFindUnique = prisma.entryType.findUnique as jest.Mock
  const mockEntryTypeUpdate = prisma.entryType.update as jest.Mock
  const mockEntryTypeDeleteMany = prisma.entryType.deleteMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SECRET_KEY = "test-secret"
  })

  describe("POST /create", () => {
    it("should successfully create the entry type", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryTypeCreate.mockResolvedValue({ id: "mock-id" })
      mockPermissionGroupFindFirst.mockResolvedValue({
        id: "perm-group-id",
        slug: "admin",
        privileges: []
      })
      mockPermissionGroupUpdate.mockResolvedValue({ id: "perm-group-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/entry-type/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          name: "Test Type",
          namespace: "test-type",
          fields: [],
          createdBy: "admin",
          status: "Published"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.result.status).toBe("success")
      expect(data.entryTypeId).toBe("mock-id")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/entry-type/create",
        query: {
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(401)
      const data = response._getJSONData()
      expect(data.message).toBe("You're not authorized!")
    })

    it("should return error if permission check fails", async () => {
      mockCheckPermissionApi.mockResolvedValue(false)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/entry-type/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(401)
      const data = response._getJSONData()
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only POST requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/entry-type/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.message).toBe("You can only do POST request for this endpoint!")
    })
  })

  describe("PUT /update/[slug]", () => {
    it("should successfully update the entry type", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryTypeFindUnique.mockResolvedValue({
        id: "mock-id",
        name: "Old Name",
        namespace: "test-type",
        slug: "test-type",
        status: "Draft",
        fieldsets: []
      })
      mockEntryTypeUpdate.mockResolvedValue({ id: "mock-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/entry-type/update",
        query: {
          slug: "mock-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          name: "New Name",
          namespace: "test-type",
          slug: "test-type",
          createdBy: "admin",
          status: "Published",
          fieldsets: []
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.status).toBe("success")
      expect(data.message).toBe("Entry Type has been updated.")
    })

    it("should return failure message if no changes were made", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      const state = {
        id: "mock-id",
        name: "Same Name",
        namespace: "test-type",
        slug: "test-type",
        status: "Published",
        fieldsets: []
      }
      mockEntryTypeFindUnique.mockResolvedValue(state)
      mockEntryTypeUpdate.mockResolvedValue(state)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/entry-type/update",
        query: {
          slug: "mock-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          name: "Same Name",
          namespace: "test-type",
          slug: "test-type",
          createdBy: "admin",
          status: "Published",
          fieldsets: []
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.status).toBe("failed")
      expect(data.message).toBe("You didn't make any change.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/entry-type/update",
        query: {
          slug: "mock-id",
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(401)
      const data = response._getJSONData()
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only PUT requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/entry-type/update",
        query: {
          slug: "mock-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.message).toBe("You can only do PUT request for this endpoint!")
    })
  })

  describe("DELETE /delete/[slug]", () => {
    it("should successfully delete the entry type", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryTypeDeleteMany.mockResolvedValue({ count: 1 })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/entry-type/delete",
        query: {
          slug: "test-type",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.status).toBe("success")
      expect(data.message).toBe("Entry Type has been deleted.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/entry-type/delete",
        query: {
          slug: "test-type",
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(401)
      const data = response._getJSONData()
      expect(data.message).toBe("You're not authorized!")
    })

    it("should accept only DELETE requests", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/entry-type/delete",
        query: {
          slug: "test-type",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await deleteRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.message).toBe("You can only do DELETE request for this endpoint!")
    })
  })
})
