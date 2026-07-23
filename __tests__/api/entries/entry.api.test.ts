/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import createRouteHandler from "@/pages/api/v1/entry/create"
import updateRouteHandler from "@/pages/api/v1/entry/update/[slug]"
import deleteRouteHandler from "@/pages/api/v1/entry/delete/[slug]"
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

describe("/api/v1/entry/", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock
  const mockEntryCreate = prisma.entry.create as jest.Mock
  const mockEntryUpdate = prisma.entry.update as jest.Mock
  const mockEntryFindUnique = prisma.entry.findUnique as jest.Mock
  const mockEntryDeleteMany = prisma.entry.deleteMany as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.SECRET_KEY = "test-secret"
  })

  describe("POST /create", () => {
    it("should successfully create the entry", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryCreate.mockResolvedValue({ id: "mock-entry-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/entry/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry created during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await createRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.result.status).toBe("success")
      expect(data.result.message).toBe("Entry has been created.")
      expect(data.entryId).toBe("mock-entry-id")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "POST",
        url: "/api/v1/entry/create",
        query: {
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry created during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
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
        url: "/api/v1/entry/create",
        query: {
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry created during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
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
    it("should successfully update the entry", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryFindUnique.mockResolvedValue({
        id: "mock-entry-id",
        name: "Old Name",
        namespace: "test-entry-type",
        slug: "api-test-entry",
        data: {}
      })
      mockEntryUpdate.mockResolvedValue({ id: "mock-entry-id" })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/entry/update",
        query: {
          slug: "mock-entry-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry updated during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
        }
      })

      const response = httpMocks.createResponse<NextApiResponse>()
      await updateRouteHandler(request, response)

      expect(response._getStatusCode()).toBe(200)
      const data = response._getJSONData()
      expect(data.status).toBe("success")
      expect(data.message).toBe("Entry has been updated.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "PUT",
        url: "/api/v1/entry/update",
        query: {
          slug: "mock-entry-id",
          apikey: "invalid-key",
          secretkey: "wrong-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry created during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
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
        url: "/api/v1/entry/update",
        query: {
          slug: "mock-entry-id",
          apikey: "system-key",
          secretkey: "test-secret",
          mockclient: "true"
        },
        body: {
          author: "tester",
          content: "This is a test entry created during API test",
          name: "API Test Entry",
          namespace: "test-entry-type",
          slug: "api-test-entry"
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
    it("should successfully delete the entry", async () => {
      mockCheckPermissionApi.mockResolvedValue(true)
      mockEntryDeleteMany.mockResolvedValue({ count: 1 })

      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/entry/delete",
        query: {
          slug: "api-test-entry",
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
      expect(data.message).toBe("Entry has been deleted.")
    })

    it("should return error if not authorized", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "DELETE",
        url: "/api/v1/entry/delete",
        query: {
          slug: "mock-entry-id",
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
        url: "/api/v1/entry/delete",
        query: {
          slug: "mock-entry-id",
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
