// __tests__/hooks/useSaveData.test.ts
import { renderHook } from "@testing-library/react"
import useSaveData from "../../../hooks/use-save-data"
import axios from "axios"

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("useSaveData Hook Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup environment variables
    process.env.baseUrl = "http://localhost:3000"
    process.env.apiKey = "test-api-key"
    process.env.secretKey = "test-secret-key"
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("ENTRY operations", () => {
    test("creates an entry successfully", async () => {
      // Mock axios post response
      mockedAxios.post.mockResolvedValueOnce({
        data: { status: "success", message: "Entry has been created." }
      })

      // Render the hook with ENTRY and CREATE params
      const { result } = renderHook(() => useSaveData("ENTRY", "CREATE"))

      // Setup test data
      const formValues = {
        name: "Test Entry",
        some_field: "Some value"
      }

      const fetchedEntryType = {
        name: "Test Type",
        namespace: "test-type",
        fields: []
      }

      // Call the saveData function
      const response = await result.current({
        formValues,
        fetchedEntryType
      })

      // Verify axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/entry/create?apikey=test-api-key&secretkey=test-secret-key`,
        expect.objectContaining({
          name: "Test Entry",
          some_field: "Some value",
          slug: "test-entry",
          namespace: "test-type"
        })
      )

      // Verify the response
      expect(response).toEqual({ status: "success", message: "Entry has been created." })
    })

    test("updates an entry successfully", async () => {
      // Mock axios put response
      mockedAxios.put.mockResolvedValueOnce({
        data: { status: "success", message: "Entry has been updated." }
      })

      // Render the hook with ENTRY and UPDATE params
      const { result } = renderHook(() => useSaveData("ENTRY", "UPDATE"))

      // Setup test data
      const formValues = {
        _id: "123456789",
        name: "Updated Entry",
        some_field: "Updated value"
      }

      const fetchedEntryType = {
        name: "Test Type",
        namespace: "test-type",
        fields: []
      }

      // Call the saveData function
      const response = await result.current({
        formValues,
        fetchedEntryType,
        slug: "test-entry"
      })

      // Verify axios was called correctly
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/entry/update/test-entry?apikey=test-api-key&secretkey=test-secret-key`,
        expect.objectContaining({
          name: "Updated Entry",
          some_field: "Updated value",
          slug: "updated-entry",
          namespace: "test-type"
        })
      )

      // Verify the response
      expect(response).toEqual({ status: "success", message: "Entry has been updated." })
    })
  })

  describe("USER operations", () => {
    test("creates a user successfully when email and username don't exist", async () => {
      // Mock axios responses
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes("/users/email/")) {
          return Promise.resolve({ data: [] })
        } else if (url.includes("/users/username/")) {
          return Promise.resolve({ data: [] })
        }
        return Promise.reject(new Error("Unknown URL"))
      })

      mockedAxios.post.mockResolvedValueOnce({
        data: { status: "success", message: "User has been created." }
      })

      // Render the hook with USER and CREATE params
      const { result } = renderHook(() => useSaveData("USER", "CREATE"))

      // Setup test data
      const formValues = {
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        permission_group: "member"
      }

      // Call the saveData function
      const response = await result.current({
        formValues
      })

      // Verify email and username existence checks were made
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/users/email/test@example.com?apikey=test-api-key`
      )
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/users/username/testuser?apikey=test-api-key`
      )

      // Verify user creation request was made
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/user/create?apikey=test-api-key&secretkey=test-secret-key`,
        formValues
      )

      // Verify the response structure
      expect(response).toEqual({
        isEmailExist: false,
        isUsernameExist: false,
        result: { data: { status: "success", message: "User has been created." } }
      })
    })

    test("doesn't create a user when email already exists", async () => {
      // Mock axios responses - email exists
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes("/users/email/")) {
          return Promise.resolve({ data: [{ email: "test@example.com" }] })
        } else if (url.includes("/users/username/")) {
          return Promise.resolve({ data: [] })
        }
        return Promise.reject(new Error("Unknown URL"))
      })

      // Render the hook with USER and CREATE params
      const { result } = renderHook(() => useSaveData("USER", "CREATE"))

      // Setup test data
      const formValues = {
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        permission_group: "member"
      }

      // Call the saveData function
      const response = await result.current({
        formValues
      })

      // Verify email and username existence checks were made
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)

      // Verify user creation request was NOT made
      expect(mockedAxios.post).not.toHaveBeenCalled()

      // Verify the response structure indicates email exists
      expect(response).toEqual({
        isEmailExist: true,
        isUsernameExist: false,
        result: {}
      })
    })
  })

  describe("Error handling", () => {
    test("handles API errors gracefully", async () => {
      // Mock a failed request
      mockedAxios.post.mockRejectedValueOnce(new Error("API Error"))

      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation()

      // Render the hook with ENTRY and CREATE params
      const { result } = renderHook(() => useSaveData("ENTRY", "CREATE"))

      // Setup test data
      const formValues = {
        name: "Test Entry",
        some_field: "Some value"
      }

      const fetchedEntryType = {
        name: "Test Type",
        namespace: "test-type",
        fields: []
      }

      // Call the saveData function
      const response = await result.current({
        formValues,
        fetchedEntryType
      })

      // Verify error was logged
      expect(consoleLogSpy).toHaveBeenCalledWith("ENTRY_CREATE_ERROR", "API Error")

      // Verify undefined is returned on error
      expect(response).toBeUndefined()

      // Restore console.log
      consoleLogSpy.mockRestore()
    })
  })
})
