import httpMocks from "node-mocks-http"
import createRouteHandler from "../../../pages/api/v1/entry/create"
import updateRouteHandler from "../../../pages/api/v1/entry/update/[slug]"
import deleteRouteHandler from "../../../pages/api/v1/entry/delete/[slug]"
import { NextApiRequest, NextApiResponse } from "next"

describe("/api/v1/entry/", () => {
  let createdEntryId: string
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("POST /create - should create the entry", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "POST",
      url: "/api/v1/entry/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        author: "tester",
        content: "This is a test entry created during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.result.status).toBe("success")
    expect(data.result.message).toBe("Entry has been created.")
    createdEntryId = data.entryId
  })

  it("GET /create - should return 'only POST request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry/create",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        author: "tester",
        content: "This is a test entry created during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
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
      url: "/api/v1/entry/create",
      query: {
        apikey: "",
        secretkey: "test",
        mockclient: "true"
      },
      body: {
        author: "tester",
        content: "This is a test entry created during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await createRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("PUT /update - should update the entry", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "PUT",
      url: "/api/v1/entry/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdEntryId
      },
      body: {
        author: "tester",
        content: "This is a test entry updated during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("Entry has been updated.")
  })
  it("GET /update - should return 'only PUT request' message", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry/update",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdEntryId
      },
      body: {
        author: "tester",
        content: "This is a test entry created during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
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
      url: "/api/v1/entry/update",
      query: {
        apikey: "",
        secretkey: "test",
        mockclient: "true",
        slug: createdEntryId
      },
      body: {
        author: "tester",
        content: "This is a test entry created during API test",
        name: "API Test Entry",
        namespace: "test-entry-type",
        slug: "api-test-entry"
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await updateRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })

  it("DELETE /delete - should delete the entry", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "DELETE",
      url: "/api/v1/entry/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdEntryId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.status).toBe("success")
    expect(data.message).toBe("Entry has been deleted.")
  })

  it("GET /delete - should return 'only DELETE request' message ", async () => {
    const request = httpMocks.createRequest<NextApiRequest>({
      method: "GET",
      url: "/api/v1/entry/delete",
      query: {
        apikey: "dbbf764d6ce785adb15a184699867b24",
        secretkey: "test",
        mockclient: "true",
        slug: createdEntryId
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
      url: "/api/v1/entry/delete",
      query: {
        apikey: "",
        secretkey: "",
        mockclient: "true",
        slug: createdEntryId
      }
    })

    const response = httpMocks.createResponse<NextApiResponse>()
    await deleteRouteHandler(request, response)
    const data = await response._getJSONData()
    expect(response._getStatusCode()).toBe(200)
    expect(data.message).toBe("You're not authorized!")
  })
})
