import "@testing-library/jest-dom"
import { ActionType } from "../../../interfaces"
import addField from "../../../lib/ui/add-field"

const mockSetFormFields = jest.fn()
const mockSetFormErrors = jest.fn()

describe("Add new field to the entry type ", () => {
  it("Create Mode", () => {
    const mockActionType: ActionType = "CREATE"
    const mockFormErrors = {}
    const mockFormFields = [
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      }
    ]
    addField(mockFormFields, mockFormErrors, mockSetFormFields, mockSetFormErrors, mockActionType)
    expect(mockSetFormErrors).toHaveBeenCalledWith({
      field_name_1: "empty-field",
      field_length_1: "empty-field",
      field_value_type_1: "empty-field",
      field_form_type_1: "empty-field"
    })
    expect(mockSetFormFields).toHaveBeenCalledWith([
      ...mockFormFields,
      {
        field_name: "",
        field_value_type: "",
        field_form_type: ""
      }
    ])
  })
  it("Update Mode", () => {
    const mockActionType: ActionType = "UPDATE"
    const mockFormErrors = {}
    const mockFieldsData = [
      {
        field_name: "",
        field_value_type: "",
        field_form_type: "",
        field_length: ""
      }
    ]
    const mockSetAnyValueChanged = jest.fn()
    const mockFormFields = [
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        },
        test1: {
          value_type: "string",
          form_type: "input",
          length: "103"
        },
        test2: {
          value_type: "string",
          form_type: "input",
          length: "104"
        }
      }
    ]
    addField(
      mockFormFields,
      mockFormErrors,
      mockSetFormFields,
      mockSetFormErrors,
      mockActionType,
      mockSetAnyValueChanged,
      mockFieldsData
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({
      field_name_1: "empty-field",
      field_length_1: "empty-field",
      field_value_type_1: "empty-field",
      field_form_type_1: "empty-field"
    })
    expect(mockSetFormFields).toHaveBeenCalledWith([
      ...mockFormFields,
      {
        field_name: "",
        field_value_type: "",
        field_form_type: ""
      }
    ])
    expect(mockSetAnyValueChanged).toHaveBeenCalledWith(true)
  })
})
