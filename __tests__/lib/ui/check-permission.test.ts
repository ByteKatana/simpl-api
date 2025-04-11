import "@testing-library/jest-dom"
import { Session } from "next-auth"
import { EntryType } from "../../../interfaces"
import checkPermission from "../../../lib/ui/check-permission"

describe("Check if user has permission to do the action", () => {
  it("Permission Group has permission for the action", () => {
    const mockSession: Session = {
      id: 123,
      user: {
        username: "mock_user",
        permission_group: "mockgroup",
        name: "mock_user",
        email: "mock_user@test.lab",
        image: "mock_image"
      },
      expires: ""
    }
    const mockEntryType = {
      _id: "67eab2699f9cf2a516412251",
      name: "mockType",
      namespace: "mocktype",
      slug: "mocktype",
      fields: [
        {
          mock_field: {
            value_type: "string",
            form_type: "input",
            length: "125"
          }
        }
      ]
    }
    const mockPermGroups = [
      {
        _id: "678966384a260b45d76bfb54",
        name: "MockGroup",
        slug: "mockgroup",
        privileges: [
          {
            mocktype: {
              permissions: ["read", "create", "update"]
            }
          }
        ]
      }
    ]
    const result = checkPermission(mockPermGroups, mockSession, "update", mockEntryType.namespace)
    expect(result).toBe(true)
  })
  it("Permission Group doesn't have the permission for the action", () => {
    const mockSession: Session = {
      id: 123,
      user: {
        username: "mock_user",
        permission_group: "mockgroup",
        name: "mock_user",
        email: "mock_user@test.lab",
        image: "mock_image"
      },
      expires: ""
    }
    const mockEntryType = {
      _id: "67eab2699f9cf2a516412251",
      name: "mockType",
      namespace: "mocktype",
      slug: "mocktype",
      fields: [
        {
          mock_field: {
            value_type: "string",
            form_type: "input",
            length: "125"
          }
        }
      ]
    }
    const mockPermGroups = [
      {
        _id: "678966384a260b45d76bfb54",
        name: "MockGroup",
        slug: "mockgroup",
        privileges: [
          {
            mocktype: {
              permissions: ["read", "create", "update"]
            }
          }
        ]
      }
    ]
    const result = checkPermission(mockPermGroups, mockSession, "delete", mockEntryType.namespace)
    expect(result).toBe(false)
  })
})
