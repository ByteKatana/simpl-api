import "@testing-library/jest-dom"
import { ContentType } from "../../../interfaces"
import handleValueChange from "../../../lib/ui/handle-value-change"
const mockSetFormErrors = jest.fn()
const mockSetShowError = jest.fn()
const mockSetAction = jest.fn()
describe("Handle the process when a value has changed in the form", () => {
  it("Handle value change with content type as field", () => {
    const mockFormData = [
      {
        _id: "67eab2699f9cf2a516690251",
        name: "test",
        namespace: "test",
        slug: "test",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      },
      {
        _id: "67eab2699f9cf2a516690351",
        name: "test1",
        namespace: "test1",
        slug: "test1",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      }
    ]
    const mockFormError = {}
    const mockShowError = {}
    const mockShowErrors = true
    const mockContentType: ContentType = "FIELD"
    const mockEvent = {
      target: {
        name: "test",
        value: "hello"
      }
    }
    handleValueChange(
      mockFormData,
      mockFormError,
      mockShowError,
      mockShowErrors,
      mockSetFormErrors,
      mockSetShowError,
      mockSetAction,
      mockEvent,
      mockContentType,
      0
    )
    //expect(mockSetFormErrors).toHaveBeenCalled()
    //expect(mockSetShowError).toHaveBeenCalled()
    expect(mockSetAction).toHaveBeenCalled()
  })
  it("Handle value change with content type as perm_group_edit/user_edit", () => {
    const mockFormData = [
      {
        _id: "67eab2699f9cf2a516690251",
        name: "test",
        namespace: "test",
        slug: "test",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      },
      {
        _id: "67eab2699f9cf2a516690351",
        name: "test1",
        namespace: "test1",
        slug: "test1",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      }
    ]
    const mockFormError = {}
    const mockShowError = {}
    const mockShowErrors = true
    const mockContentType: ContentType = "USER_EDIT"
    const mockEvent = {
      target: {
        name: "test",
        value: "hello"
      }
    }
    handleValueChange(
      mockFormData,
      mockFormError,
      mockShowError,
      mockShowErrors,
      mockSetFormErrors,
      mockSetShowError,
      mockSetAction,
      mockEvent,
      mockContentType
    )
    //expect(mockSetFormErrors).toHaveBeenCalled()
    //expect(mockSetShowError).toHaveBeenCalled()
    expect(mockSetAction).toHaveBeenCalled()
  })
  it("Handle value change with content type as entry", () => {
    const mockFormData = [
      {
        _id: "67eab2699f9cf2a516690251",
        name: "test",
        namespace: "test",
        slug: "test",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      },
      {
        _id: "67eab2699f9cf2a516690351",
        name: "test1",
        namespace: "test1",
        slug: "test1",
        fields: [
          {
            test_field: {
              value_type: "string",
              form_type: "input",
              length: "101"
            }
          }
        ]
      }
    ]
    const mockFormError = {}
    const mockShowError = {}
    const mockShowErrors = true
    const mockContentType: ContentType = "ENTRY"
    const mockEvent = {
      target: {
        name: "test",
        value: "hello"
      }
    }
    handleValueChange(
      mockFormData,
      mockFormError,
      mockShowError,
      mockShowErrors,
      mockSetFormErrors,
      mockSetShowError,
      mockSetAction,
      mockEvent,
      mockContentType
    )
    expect(mockSetAction).toHaveBeenCalled()
  })
})
