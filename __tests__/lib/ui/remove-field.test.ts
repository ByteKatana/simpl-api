import "@testing-library/jest-dom"
import { ActionType } from "../../../interfaces"
import removeField from "../../../lib/ui/remove-field"

const mockSetFormFields = jest.fn()
const mockSetFormErrors = jest.fn()

describe("Remove a field from the entry type", () => {
  it("Create Mode", () => {
    const mockActionType: ActionType = "CREATE"
    const mockFormErrors = {
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      },
      "1": {
        field_name_1: "empty-field",
        field_length_1: "empty-field",
        field_value_type_1: "empty-field",
        field_form_type_1: "empty-field"
      }
    }
    const mockFormFields = [
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      },
      {
        test1: {
          value_type: "string",
          form_type: "input",
          length: "103"
        }
      }
    ]

    removeField(mockFormFields, mockFormErrors, mockSetFormFields, mockSetFormErrors, 1, mockActionType)
    expect(mockSetFormErrors).toHaveBeenCalledWith({
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      }
    })
    expect(mockSetFormFields).toHaveBeenCalledWith([
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      }
    ])
  })
  it("Update Mode", () => {
    const mockActionType: ActionType = "UPDATE"
    const mockSetAnyValueChanged = jest.fn()
    const mockFormErrors = {
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      },
      "1": {
        field_name_1: "empty-field",
        field_length_1: "empty-field",
        field_value_type_1: "empty-field",
        field_form_type_1: "empty-field"
      }
    }
    const mockFormFields = [
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      },
      {
        test1: {
          value_type: "string",
          form_type: "input",
          length: "103"
        }
      }
    ]
    const mockFieldsData = [
      {
        field_name: "test",
        field_value_type: "string",
        field_form_type: "input",
        field_length: "102"
      },
      {
        field_name: "test1",
        field_value_type: "string",
        field_form_type: "input",
        field_length: "103"
      }
    ]
    removeField(
      mockFormFields,
      mockFormErrors,
      mockSetFormFields,
      mockSetFormErrors,
      1,
      mockActionType,
      mockSetAnyValueChanged,
      mockFieldsData
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      }
    })
    expect(mockSetAnyValueChanged).toHaveBeenCalledWith(true)
    expect(mockSetFormFields).toHaveBeenCalledWith([
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      }
    ])
  })
  it("Update Mode with newly added empty field", () => {
    const mockActionType: ActionType = "UPDATE"
    const mockSetAnyValueChanged = jest.fn()
    const mockFormErrors = {
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      },
      "1": {
        field_name_1: "empty-field",
        field_length_1: "empty-field",
        field_value_type_1: "empty-field",
        field_form_type_1: "empty-field"
      }
    }
    const mockFormFields = [
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      },
      {
        test1: {
          value_type: "string",
          form_type: "input",
          length: "103"
        }
      },
      {
        test2: {
          value_type: "string",
          form_type: "input",
          length: "105"
        }
      }
    ]
    const mockFieldsData = [
      {
        field_name: "test",
        field_value_type: "string",
        field_form_type: "input",
        field_length: "102"
      },
      {
        field_name: "test1",
        field_value_type: "string",
        field_form_type: "input",
        field_length: "103"
      }
    ]
    removeField(
      mockFormFields,
      mockFormErrors,
      mockSetFormFields,
      mockSetFormErrors,
      1,
      mockActionType,
      mockSetAnyValueChanged,
      mockFieldsData
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({
      "0": {
        field_name_0: "empty-field",
        field_length_0: "empty-field",
        field_value_type_0: "empty-field",
        field_form_type_0: "empty-field"
      }
    })
    expect(mockSetAnyValueChanged).toHaveBeenCalledWith(false)
    expect(mockSetFormFields).toHaveBeenCalledWith([
      {
        test: {
          value_type: "string",
          form_type: "input",
          length: "102"
        }
      }
    ])
  })
})
