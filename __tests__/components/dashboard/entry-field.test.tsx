import "@testing-library/jest-dom"
import React, { MutableRefObject, useRef } from "react"
import EntryField from "../../../components/dashboard/entry-field"
import { render } from "@testing-library/react"

const mockSetShowError = jest.fn()
const mockSetFormErrors = jest.fn()
const mockSetFormValues = jest.fn()

describe("Check if EntryField component rendered properly", () => {
  it("Render TextArea entry field properly", () => {
    const mockField = {
      mock_field: {
        value_type: "string",
        form_type: "textarea",
        length: "101"
      }
    }
    const mockKey = 1
    const mockFormRef = {
      current: {
        mock_field: {
          value_type: "string",
          form_type: "textarea",
          length: "101"
        },
        focus: jest.fn()
      }
    } as MutableRefObject<any>
    const mockFormValues = {
      name: "",
      slug: "",
      namespace: ""
    }
    const mockShowError = {}
    const mockFormErrors = {}
    const mockShowErrors = true

    const entryField = render(
      <EntryField
        key={mockKey}
        field={mockField}
        formRef={mockFormRef}
        formValues={mockFormValues}
        formErrors={mockFormErrors}
        showErrors={mockShowErrors}
        showError={mockShowError}
        setFormErrors={mockSetFormErrors}
        setShowError={mockSetShowError}
        setFormValues={mockSetFormValues}
      />
    )

    expect(entryField.getByRole("textbox"))
  })
  it("Render Input entry field properly", () => {
    const mockField = {
      mock_field: {
        value_type: "string",
        form_type: "input",
        length: "101"
      }
    }
    const mockKey = 1
    const mockFormRef = {
      current: {
        mock_field: {
          value_type: "string",
          form_type: "textarea",
          length: "101"
        },
        focus: jest.fn()
      }
    } as MutableRefObject<any>
    const mockFormValues = {
      name: "",
      slug: "",
      namespace: ""
    }
    const mockShowError = {}
    const mockFormErrors = {}
    const mockShowErrors = true

    const entryField = render(
      <EntryField
        key={mockKey}
        field={mockField}
        formRef={mockFormRef}
        formValues={mockFormValues}
        formErrors={mockFormErrors}
        showErrors={mockShowErrors}
        showError={mockShowError}
        setFormErrors={mockSetFormErrors}
        setShowError={mockSetShowError}
        setFormValues={mockSetFormValues}
      />
    )

    expect(entryField.getByRole("textbox"))
  })
})
