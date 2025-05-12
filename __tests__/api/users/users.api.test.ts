import httpMocks from "node-mocks-http"
import indexRouteHandler from "../../../pages/api/v1/users/index"
import slugRouteHandler from "../../../pages/api/v1/users/[slug]"
import paramRouteHandler from "../../../pages/api/v1/users/[...param]"
import { NextApiRequest, NextApiResponse } from "next"

describe("/api/v1/users", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  /*  it("GET / - should return all users", async () => {
      const request = httpMocks.createRequest<NextApiRequest>({
        method: "GET",
        url: "/api/v1/users",
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
    })*/

  it("GET / - should return 'You're not authorized' if there is no API key ", async () => {
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
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("GET /first_X -  should return first X user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /last_X -  should return last X user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /random_X -  should return random X user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
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

  it("GET /api/v1/users/:permission-group -  should return users from a permission group", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        slug: "admin"
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await slugRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    data.forEach((user: any) => {
      expect(user.permission_group).toEqual("admin")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/ -  should return users from a property key and value", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["username", "mock_user"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    data.forEach((user: any) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/first_X - should return first X users from a property key and value  ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["username", "mock_user", "first_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: any) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/last_X - should return last X users from a property key and value  ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["username", "mock_user", "last_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: any) => {
      expect(user.username).toEqual("mock_user")
    })
  })

  it("GET /api/v1/users/:property-key/:property-value/random_X - should return random X users from a property key and value  ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/users",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        param: ["username", "mock_user", "random_3"]
      }
    })
    const response = httpMocks.createResponse<NextApiResponse>()

    await paramRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.length).toBeLessThanOrEqual(3)
    data.forEach((user: any) => {
      expect(user.username).toEqual("mock_user")
    })
  })
})
