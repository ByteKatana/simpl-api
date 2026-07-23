/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import indexRouteHandler from "@/pages/api/v1/users/index"
import slugRouteHandler from "@/pages/api/v1/users/[slug]"
import paramRouteHandler from "@/pages/api/v1/users/[...param]"
import { NextApiRequest, NextApiResponse } from "next"
import { User } from "@/interfaces"
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

describe("/api/v1/users", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("GET / - should return all users", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()

    await indexRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    // users with permission_group "root" are filtered out, so it will be 4 instead of 5
    expect(data.length).toBe(4)
  })

  it("GET / - should return 'You're not authorized' if there is no API key", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /first_X - should return first X user", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /last_X - should return last X user", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /random_X - should return random X user", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /api/v1/users/:permission-group - should return users from a permission group", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key",
        slug: "admin"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    data.forEach((user: User) => {
      expect(user.permission_group).toEqual("admin")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/ - should return users from a property key and value", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key",
        param: ["username", "mock_user"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    data.forEach((user: User) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/first_X - should return first X users from a property key and value", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key",
        param: ["username", "mock_user", "first_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: User) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/last_X - should return last X users from a property key and value", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key",
        param: ["username", "mock_user", "last_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: User) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/random_X - should return random X users from a property key and value", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "system-key",
        param: ["username", "mock_user", "random_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: User) => {
      expect(user.username).toEqual("mock_user")
    })
  })
})
