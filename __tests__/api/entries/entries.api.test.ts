import httpMocks from "node-mocks-http"
import { NextApiRequest, NextApiResponse } from "next"
import indexRouteHandler from "../../../pages/api/v1/entries/index"
import slugRouteHandler from "../../../pages/api/v1/entries/[slug]"
import paramRouteHandler from "../../../pages/api/v1/entries/[...param]"
import { Entry } from "../../../interfaces"

describe("/api/v1/entries/", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("GET / - should return all entries", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
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
      url: "/api/v1/entries",
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

  it("GET /first_X -  should return first X entries", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "first_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).not.toBe({ message: "You're not authorized!" })
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /last_X -  should return last X entries", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "last_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).not.toBe({ message: "You're not authorized!" })
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /random_X -  should return random X entries", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "random_3"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).not.toBe({ message: "You're not authorized!" })
    expect(data.length).toBeLessThanOrEqual(3)
  })

  it("GET /api/v1/entries/:namespace -  should return entries from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
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

  it("GET /api/v1/entries/:namespace/first_X - should return first X entries from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["test-entry-type", "first_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("test-entry-type")
    })
  })

  it("GET /api/v1/entries/:namespace/last_X - should return last X entries from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["test-entry-type", "last_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("test-entry-type")
    })
  })

  it("GET /api/v1/entries/:namespace/random_X - should return random X entries from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entries",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["test-entry-type", "random_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entry: Entry) => {
      expect(entry.namespace).toEqual("test-entry-type")
    })
  })
})
