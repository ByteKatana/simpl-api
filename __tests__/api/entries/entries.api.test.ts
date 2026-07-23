/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import { NextApiRequest, NextApiResponse } from "next"
import indexRouteHandler from "@/pages/api/v1/entries/index"
import slugRouteHandler from "@/pages/api/v1/entries/[slug]"
import paramRouteHandler from "@/pages/api/v1/entries/[...param]"
import { Entry } from "@/interfaces"
import checkPermissionApi from "@/lib/check-permission-api"

// Mock rate limiting to be a direct pass-through to simplify route testing
jest.mock("@/lib/api/rate-limits", () => require("@/__mocks__/lib/api/rate-limits"))

// Mock permission checking API helper to isolate controller validation
jest.mock("@/lib/check-permission-api", () => require("@/__mocks__/lib/check-permission-api"))

// Mock API key controller and utility checks
jest.mock("@/lib/api/utils", () => require("@/__mocks__/lib/api/utils"))

jest.mock("@/controllers/api-key.controller", () => require("@/__mocks__/controllers/api-key.controller"))

// Mock apiBuilderController to bypass MongoDB queries and return mock objects directly
jest.mock("@/controllers/api-builder.controller", () =>
  require("@/__mocks__/controllers/api-builder.controller")
)

describe("/api/v1/entries", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("GET / - should return all entries", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await indexRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(5)
  })

  it("GET / - should return 'You're not authorized' if there is no API key", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: ""
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await indexRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(401)
    expect(data.message).toBe("You're not authorized!")
  })

  it("GET /first_X - should return first X entries", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        slug: "first_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /last_X - should return last X entries", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        slug: "last_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /random_X - should return random X entries", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        slug: "random_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /api/v1/entries/:namespace - should return entries from a namespace", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        slug: "test-entry-type"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("test-entry-type")
    })
  })

  it("GET /api/v1/entries/:namespace-part-1/:namespace-part-2/ - should return entries from sub-namespace", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        param: ["newtest", "newtest1"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/entries/:namespace-part-1/:namespace-part-2/first_x - should return first X entries from sub-namespace", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        param: ["newtest", "newtest1", "first_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/entries/:namespace-part-1/:namespace-part-2/last_x - should return last X entries from sub-namespace", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        param: ["newtest", "newtest1", "last_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/entries/:namespace-part-1/:namespace-part-2/random_x - should return random X entries from sub-namespace", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "system-key",
        param: ["newtest", "newtest1", "random_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("newtest.newtest1")
    })
  })
})
