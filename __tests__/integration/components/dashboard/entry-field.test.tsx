import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import EntryField from "../../../../components/dashboard/entry-field"

// Mock implementations for the dependencies
jest.mock("../../../../lib/ui/check-field-empty", () => {
  return jest.fn()
})

jest.mock("../../../../lib/ui/handle-value-change", () => {
  return jest.fn()
})

describe("EntryField Integration Tests", () => {
  // Common test setup
  const mockSetFormErrors = jest.fn()
  const mockSetShowError = jest.fn()
  const mockSetFormValues = jest.fn()
  const mockFormRef = { current: {} }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Text Input Rendering", () => {
    const textFieldProps = {
      key: 1,
      field: { name: { form_type: "text", value_type: "string", length: 50 } },
      formRef: mockFormRef,
      formValues: { name: "" },
      formErrors: {},
      showErrors: false,
      showError: {},
      setFormErrors: mockSetFormErrors,
      setShowError: mockSetShowError,
      setFormValues: mockSetFormValues
    }

    it("renders text input with correct label", () => {
      render(<EntryField {...textFieldProps} />)

      expect(screen.getByLabelText("Name")).toBeInTheDocument()
      expect(screen.getByRole("textbox")).toBeInTheDocument()
    })

    it("shows error message when field is empty and blurred", async () => {
      const user = userEvent.setup()
      const formErrors = { name: "empty-field" }
      const showError = { name: true }

      render(<EntryField {...textFieldProps} formErrors={formErrors} showError={showError} />)

      const input = screen.getByRole("textbox")
      await user.click(input)
      await user.tab() // Blur the field

      expect(screen.getByText("This field is required.")).toBeInTheDocument()
    })

    it("calls handleValueChange when input changes", async () => {
      const user = userEvent.setup()
      const handleValueChangeMock = require("../../../../lib/ui/handle-value-change")

      render(<EntryField {...textFieldProps} />)

      const input = screen.getByRole("textbox")
      await user.type(input, "Test value")

      expect(handleValueChangeMock).toHaveBeenCalled()
    })

  })

  describe("Textarea Rendering", () => {
    const textareaFieldProps = {
      key: 1,
      field: { description: { form_type: "textarea", value_type: "string", length: 200 } },
      formRef: mockFormRef,
      formValues: { description: "" },
      formErrors: {},
      showErrors: false,
      showError: {},
      setFormErrors: mockSetFormErrors,
      setShowError: mockSetShowError,
      setFormValues: mockSetFormValues
    }

    it("renders textarea with correct label", () => {
      render(<EntryField {...textareaFieldProps} />)

      expect(screen.getByLabelText("Description")).toBeInTheDocument()
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3")
    })

    it("shows length error when exceeding maximum length", async () => {
      const user = userEvent.setup()
      const formErrors = { description_length: "length-error" }
      const showError = { description_length: true }

      render(<EntryField {...textareaFieldProps} formErrors={formErrors} showError={showError} />)

      expect(screen.getByText("Maximum length is 200.")).toBeInTheDocument()
    })
  })

  describe("Validation Types", () => {
    const numberFieldProps = {
      key: 1,
      field: { amount: { form_type: "text", value_type: "number", length: 10 } },
      formRef: mockFormRef,
      formValues: { amount: "" },
      formErrors: { amount_rule: "number-field" },
      showErrors: true,
      showError: {},
      setFormErrors: mockSetFormErrors,
      setShowError: mockSetShowError,
      setFormValues: mockSetFormValues
    }

    it("shows type validation error for non-number input in number field", () => {
      render(<EntryField {...numberFieldProps} />)

      expect(screen.getByText("This field must be number.")).toBeInTheDocument()
    })
  })

  describe("Integration with form state", () => {
    it("updates form reference when rendered", () => {
      const props = {
        key: 1,
        field: { title: { form_type: "text", value_type: "string", length: 100 } },
        formRef: mockFormRef,
        formValues: { title: "Initial Value" },
        formErrors: {},
        showErrors: false,
        showError: {},
        setFormErrors: mockSetFormErrors,
        setShowError: mockSetShowError,
        setFormValues: mockSetFormValues
      }

      render(<EntryField {...props} />)

      // Check if formRef has been updated
      expect(mockFormRef.current).toHaveProperty("title")
    })
  })
})
