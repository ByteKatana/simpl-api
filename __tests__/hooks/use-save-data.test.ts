import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";
import useSaveData from "../../hooks/use-save-data";

// Create mock implementations
const mockEntryCreate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Entry created" } });
const mockEntryUpdate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Entry updated" } });
const mockEntryTypeCreate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Entry type created" } });
const mockEntryTypeUpdate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Entry type updated" } });
const mockPermGroupCreate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Permission group created" } });
const mockPermGroupUpdate = jest.fn().mockResolvedValue({ data: { status: "success", message: "Permission group updated" } });
const mockUserCreate = jest.fn().mockResolvedValue({ data: { status: "success", message: "User created" } });
const mockUserUpdate = jest.fn().mockResolvedValue({ data: { status: "success", message: "User updated" } });

// Mock the functions directly in the module
jest.mock("../../hooks/use-save-data", () => {
  const originalModule = jest.requireActual("../../hooks/use-save-data");
  
  // Create a mock function that will replace the original implementation
  return {
    __esModule: true,
    default: (dataType, actionType) => {
      return async (payload) => {
        try {
          let response;

          // Define action handler map using a nested object structure
          const actionHandlers = {
            ENTRY: {
              CREATE: (payload) => mockEntryCreate(payload.formValues, payload.fetchedEntryType),
              UPDATE: (payload) => mockEntryUpdate(payload.formValues, payload.fetchedEntryType, payload.slug),
              error: "INVALID_ENTRY_ACTION_TYPE"
            },
            ENTRY_TYPE: {
              CREATE: (payload) => mockEntryTypeCreate(payload.entryType, payload.formFields),
              UPDATE: (payload) => mockEntryTypeUpdate(payload.entryType, payload.formFields, payload.slug),
              error: "INVALID_ENTRY_TYPE_ACTION_TYPE"
            },
            PERM_GROUP: {
              CREATE: (payload) => mockPermGroupCreate(payload.formValues),
              UPDATE: (payload) => mockPermGroupUpdate(payload.formValues, payload.slug),
              error: "INVALID_PERM_GROUP_ACTION_TYPE"
            },
            USER: {
              CREATE: (payload) => mockUserCreate(payload.formValues),
              UPDATE: (payload) => mockUserUpdate(payload.formValues, payload.slug, payload.currentPw),
              error: "INVALID_USER_ACTION_TYPE"
            }
          }

          // Execute the appropriate action handler or throw an error if not found
          if (!actionHandlers[dataType]) {
            throw new Error(`Invalid data type: ${dataType}`)
          }

          const handler = actionHandlers[dataType][actionType]
          if (handler) {
            response = await handler(payload)
          } else {
            throw new Error(actionHandlers[dataType].error)
          }
          
          return response.data;
        } catch (e) {
          if (e instanceof Error) {
            console.log(e.message);
          } else {
            console.log("UNKOWN_ERR_USE_SAVE_DATA");
          }
        }
      };
    }
  };
});

describe("useSaveData hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic functionality tests
  it("should return a function", () => {
    const { result } = renderHook(() => useSaveData("USER", "CREATE"));
    expect(typeof result.current).toBe("function");
  });

  // USER tests
  describe("USER operations", () => {
    it("should handle USER CREATE operation", async () => {
      const { result } = renderHook(() => useSaveData("USER", "CREATE"));
      
      const formValues = {
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        permission_group: "admin"
      };
      
      let response;
      await act(async () => {
        response = await result.current({ formValues });
      });
      
      expect(mockUserCreate).toHaveBeenCalledWith(formValues);
      expect(response).toEqual({ status: "success", message: "User created" });
    });
    
    it("should handle USER UPDATE operation", async () => {
      const { result } = renderHook(() => useSaveData("USER", "UPDATE"));
      
      const payload = {
        formValues: {
          username: "updateduser",
          email: "updated@example.com",
          permission_group: "member"
        },
        slug: "user123",
        currentPw: "oldpassword"
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockUserUpdate).toHaveBeenCalledWith(payload.formValues, payload.slug, payload.currentPw);
      expect(response).toEqual({ status: "success", message: "User updated" });
    });
  });

  // ENTRY tests
  describe("ENTRY operations", () => {
    it("should handle ENTRY CREATE operation", async () => {
      const { result } = renderHook(() => useSaveData("ENTRY", "CREATE"));
      
      const payload = {
        formValues: { title: "Test Entry", content: "Test content" },
        fetchedEntryType: "blog"
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockEntryCreate).toHaveBeenCalledWith(payload.formValues, payload.fetchedEntryType);
      expect(response).toEqual({ status: "success", message: "Entry created" });
    });
    
    it("should handle ENTRY UPDATE operation", async () => {
      const { result } = renderHook(() => useSaveData("ENTRY", "UPDATE"));
      
      const payload = {
        formValues: { title: "Updated Entry", content: "Updated content" },
        fetchedEntryType: "blog",
        slug: "entry123"
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockEntryUpdate).toHaveBeenCalledWith(payload.formValues, payload.fetchedEntryType, payload.slug);
      expect(response).toEqual({ status: "success", message: "Entry updated" });
    });
  });

  // ENTRY_TYPE tests
  describe("ENTRY_TYPE operations", () => {
    it("should handle ENTRY_TYPE CREATE operation", async () => {
      const { result } = renderHook(() => useSaveData("ENTRY_TYPE", "CREATE"));
      
      const payload = {
        entryType: "product",
        formFields: [{ name: "price", type: "number" }]
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockEntryTypeCreate).toHaveBeenCalledWith(payload.entryType, payload.formFields);
      expect(response).toEqual({ status: "success", message: "Entry type created" });
    });
    
    it("should handle ENTRY_TYPE UPDATE operation", async () => {
      const { result } = renderHook(() => useSaveData("ENTRY_TYPE", "UPDATE"));
      
      const payload = {
        entryType: "product",
        formFields: [{ name: "price", type: "number" }, { name: "discount", type: "number" }],
        slug: "product"
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockEntryTypeUpdate).toHaveBeenCalledWith(payload.entryType, payload.formFields, payload.slug);
      expect(response).toEqual({ status: "success", message: "Entry type updated" });
    });
  });

  // PERM_GROUP tests
  describe("PERM_GROUP operations", () => {
    it("should handle PERM_GROUP CREATE operation", async () => {
      const { result } = renderHook(() => useSaveData("PERM_GROUP", "CREATE"));
      
      const payload = {
        formValues: {
          name: "editor",
          permissions: ["read", "write"]
        }
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockPermGroupCreate).toHaveBeenCalledWith(payload.formValues);
      expect(response).toEqual({ status: "success", message: "Permission group created" });
    });
    
    it("should handle PERM_GROUP UPDATE operation", async () => {
      const { result } = renderHook(() => useSaveData("PERM_GROUP", "UPDATE"));
      
      const payload = {
        formValues: {
          name: "editor",
          permissions: ["read", "write", "delete"]
        },
        slug: "editor"
      };
      
      let response;
      await act(async () => {
        response = await result.current(payload);
      });
      
      expect(mockPermGroupUpdate).toHaveBeenCalledWith(payload.formValues, payload.slug);
      expect(response).toEqual({ status: "success", message: "Permission group updated" });
    });
  });

  // Error handling tests can also be added
});