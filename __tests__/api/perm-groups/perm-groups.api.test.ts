/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import httpMocks from "node-mocks-http"
import { NextApiRequest, NextApiResponse } from "next"
import indexRouteHandler from "@/pages/api/v1/permission-groups/index"
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

describe("/api/v1/permission-groups/", () => {
  const mockCheckPermissionApi = checkPermissionApi as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("GET / - should return all permission groups", async () => {
    mockCheckPermissionApi.mockResolvedValue(true)

    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-groups",
      query: {
        apikey: "system-key"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()

    await indexRouteHandler(request, response)
    const data = await response._getJSONData()

    expect(response._getStatusCode()).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    // The mock currently returns 5 objects
    expect(data.length).toBe(5)
  })

  it("GET / - should return 'You're not authorized' if there is no API key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-groups",
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
})
