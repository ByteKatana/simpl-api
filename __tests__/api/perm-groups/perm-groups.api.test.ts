import httpMocks from "node-mocks-http"
import { NextApiRequest, NextApiResponse } from "next"
import indexRouteHandler from "../../../pages/api/v1/permission-groups/index"

describe("/api/v1/permission-groups/", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("GET / - should return all permission groups", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-groups",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()

    await indexRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).not.toBe({ message: "You're not authorized!" })
    expect(Array.isArray(data)).toBe(true)
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
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })
})
