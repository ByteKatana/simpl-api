import httpMocks from "node-mocks-http"
import generateRouteHandler from "../../../pages/api/v1/key/generate"
import listAllRouteHandler from "../../../pages/api/v1/key/list-all"
import removeRouteHandler from "../../../pages/api/v1/key/remove/[slug]"
import { NextApiRequest, NextApiResponse } from "next"

describe("/api/v1/entry/", () => {
  let generatedAPIKeyId: string
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("GET / - should return all keys", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/key/list-all",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()

    await listAllRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).not.toBe({ message: "You're not authorized!" })
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })
  it("GET /generate - should generate and return an API key", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/key/generate",
      query: {
        secretkey: "test"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await generateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.result.status).toBe("success")
    expect(data.result.message).toBe("API Key has been generated.")
    expect(data.key.length).toBe(32)
    generatedAPIKeyId = data.result.keyId
  })

  it("GET /generate - should return 'You're not authorized!' message if there is no API key or secret key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      url: "/api/v1/key/generate",
      query: {
        secretkey: ""
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await generateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("DELETE /remove - should remove the API key", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/key/remove",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: generatedAPIKeyId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await removeRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("API Key has been removed.")
  })

  it("GET /remove - should return 'only DELETE request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/key/remove",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: generatedAPIKeyId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await removeRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You can only do DELETE request for this endpoint!")
  })

  it("DELETE /remove - should return 'You're not authorized!' message if there is no API key or secret key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/key/remove",
      query: {
        apikey: "",
        secretkey: "",
        slug: generatedAPIKeyId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await removeRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })
})
