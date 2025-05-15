import httpMocks from "node-mocks-http"
import { NextApiRequest, NextApiResponse } from "next"
import indexRouteHandler from "../../../pages/api/v1/entry-types/index"
import slugRouteHandler from "../../../pages/api/v1/entry-types/[slug]"
import paramRouteHandler from "../../../pages/api/v1/entry-types/[...param]"
import { EntryType } from "../../../interfaces"

describe("/api/v1/entry-types", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("GET / - should return all entry types", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
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
      url: "/api/v1/entry-types",
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

  it("GET /first_X -  should return first X user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
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

  it("GET /last_X -  should return last X entry types", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
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

  it("GET /random_X -  should return random X entry types", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
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

  it("GET /api/v1/users/:namespace -  should return entry types from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "test-entry-type"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("test-entry-type")
    })
  })

  it("GET /api/v1/users/:namespace -  should return entry types from a namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "test-entry-type"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("test-entry-type")
    })
  })

  it("GET /api/v1/users/:namespace-part-1/:namespace-part-2/ -  should return entry types from sub-namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["newtest", "newtest1"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/users/:namespace-part-1/:namespace-part-2/first_x -  should return first X entry types from sub-namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["newtest", "newtest1", "first_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/users/:namespace-part-1/:namespace-part-2/last_x -  should return last X entry types from sub-namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["newtest", "newtest1", "last_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("newtest.newtest1")
    })
  })

  it("GET /api/v1/users/:namespace-part-1/:namespace-part-2/random_x -  should return random X entry types from sub-namespace", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry-types",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["newtest", "newtest1", "random_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((entryType: EntryType) => {
      expect(entryType.namespace).toEqual("newtest.newtest1")
    })
  })
})
