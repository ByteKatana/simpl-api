import httpMocks from "node-mocks-http"
import createRouteHandler from "../../../pages/api/v1/permission-group/create"
import updateRouteHandler from "../../../pages/api/v1/permission-group/update/[slug]"
import deleteRouteHandler from "../../../pages/api/v1/permission-group/delete/[slug]"
import { NextApiRequest, NextApiResponse } from "next"

describe("/api/v1/permission-group/", () => {
  let createdPermGroupId: string
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("POST /create - should create the permission group", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      url: "/api/v1/permission-group/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        name: "Tester",
        privileges: [],
        slug: "tester"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.result.status).toBe("success")
    expect(data.result.message).toBe("Permission group has been created.")
    createdPermGroupId = data.permGroupId
  })

  it("GET /create - should return 'only POST request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-group/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        name: "Tester",
        privileges: [],
        slug: "tester"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You can only do POST request for this endpoint!")
  })

  it("POST /create - should return 'You're not authorized!' message if there is no API key or secret key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      url: "/api/v1/permission-group/create",
      query: {
        apikey: "",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        name: "Tester",
        privileges: [],
        slug: "tester"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("PUT /update - should update the permission group", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "PUT",
      url: "/api/v1/permission-group/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdPermGroupId
      },
      body: {
        name: "Tester1",
        privileges: [
          {
            products: {
              permissions: ["read", "create", "update", "delete"]
            }
          }
        ],
        slug: "tester1"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("Permission group has been updated.")
  })
  it("GET /update - should return 'only PUT request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-group/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdPermGroupId
      },
      body: {
        name: "Tester1",
        privileges: [
          {
            products: {
              permissions: ["read", "create", "update", "delete"]
            }
          }
        ],
        slug: "tester1"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You can only do PUT request for this endpoint!")
  })

  it("PUT /update - should return 'You're not authorized!' message if there is no API key or secret key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "PUT",
      url: "/api/v1/permission-group/update",
      query: {
        apikey: "",
        secretkey: "test",
        mockclient: "true",
        slug: createdPermGroupId
      },
      body: {
        name: "Tester1",
        privileges: [
          {
            products: {
              permissions: ["read", "create", "update", "delete"]
            }
          }
        ],
        slug: "tester1"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("DELETE /delete - should delete the permission group", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/permission-group/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdPermGroupId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("Permission group has been deleted.")
  })

  it("GET /delete - should return 'only DELETE request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/permission-group/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdPermGroupId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You can only do DELETE request for this endpoint!")
  })

  it("DELETE /delete - should return 'You're not authorized!' message if there is no API key or secret key ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/permission-group/delete",
      query: {
        apikey: "",
        secretkey: "",
        mockclient: "true",
        slug: createdPermGroupId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })
})
