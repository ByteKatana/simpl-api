import httpMocks from "node-mocks-http"
import createRouteHandler from "../../../pages/api/v1/user/create"
import updateRouteHandler from "../../../pages/api/v1/user/update/[slug]"
import deleteRouteHandler from "../../../pages/api/v1/user/delete/[slug]"
import { NextApiRequest, NextApiResponse } from "next"

describe("/api/v1/user/", () => {
  let createdUserId: string
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("POST /create - should create the user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      url: "/api/v1/user/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.result.status).toBe("success")
    expect(data.result.message).toBe("User has been created.")
    createdUserId = data.userId
  })

  it("GET /create - should return 'only POST request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/user/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test"
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
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
      url: "/api/v1/user/create",
      query: {
        apikey: "",
        secretkey: "",
        mockclient: "true"
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("PUT /update - should update the user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "PUT",
      url: "/api/v1/user/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: createdUserId,
        mockclient: "true"
      },
      body: {
        username: "mocki_user1",
        password: "superpowerful1password1",
        pwchanged: true,
        email: "mock_user_new_email@test.local",
        permission_group: "member"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("User has been updated.")
  })
  it("GET /update - should return 'only PUT request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/user/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: createdUserId
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
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
      method: "POST",
      url: "/api/v1/user/update",
      query: {
        apikey: "",
        secretkey: "",
        mockclient: "true",
        slug: createdUserId
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("DELETE /delete - should delete the user", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/user/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: createdUserId,
        mockclient: "true"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("User has been deleted.")
  })

  it("GET /delete - should return 'only DELETE request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/user/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        slug: createdUserId
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
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
      method: "POST",
      url: "/api/v1/user/create",
      query: {
        apikey: "",
        secretkey: "",
        mockclient: "true",
        slug: createdUserId
      },
      body: {
        username: "mock_user",
        password: "superpowerfulpassword",
        email: "mock_user@test.local",
        permission_group: "member"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })
})
