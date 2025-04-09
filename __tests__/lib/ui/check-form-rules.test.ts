import "@testing-library/jest-dom"
import React, { SetStateAction } from "react"
import checkFormRules from "../../../lib/ui/check-form-rules"

const mockSetShowError: React.Dispatch<SetStateAction<object>> = jest.fn()
const mockSetFormErrors: React.Dispatch<SetStateAction<object>> = jest.fn()

describe("Check if values meets given form rules", () => {
  it("Check if value is not string", () => {
    const mockFormErrors = {}
    const mockShowError = {}
    const mockEventError = {
      target: {
        name: "description",
        value: 3
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "string", mockEventError)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ description_rule: "string-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: true })
  })

  it("Check if value is string", () => {
    const mockFormErrors = { description_rule: "string-field" }
    const mockShowError = {}
    const mockEventValid = {
      target: {
        name: "description",
        value: "abc"
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "string", mockEventValid)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })
  })

  it("Check if value is not integer", () => {
    const mockFormErrors = {}
    const mockShowError = {}
    const mockEvent = {
      target: {
        name: "description",
        value: "abc"
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "integer", mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ description_rule: "integer-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: true })
  })

  it("Check if value is integer", () => {
    const mockFormErrors = { description_rule: "integer-field" }
    const mockShowError = {}
    const mockEventValid = {
      target: {
        name: "description",
        value: 3
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "integer", mockEventValid)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })

    const mockEventValidString = {
      target: {
        name: "description",
        value: "3"
      }
    }
    checkFormRules(
      mockFormErrors,
      mockShowError,
      true,
      mockSetShowError,
      mockSetFormErrors,
      "integer",
      mockEventValidString
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })
  })

  it("Check if value is not double", () => {
    const mockFormErrors = {}
    const mockShowError = {}
    const mockEvent = {
      target: {
        name: "description",
        value: 3
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "double", mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ description_rule: "integer-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: true })
  })

  it("Check if value is double", () => {
    const mockFormErrors = { description_rule: "double-field" }
    const mockShowError = {}
    const mockEventValid = {
      target: {
        name: "description",
        value: 3.5
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "double", mockEventValid)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })

    const mockEventValidString = {
      target: {
        name: "description",
        value: "3.5"
      }
    }
    checkFormRules(
      mockFormErrors,
      mockShowError,
      true,
      mockSetShowError,
      mockSetFormErrors,
      "double",
      mockEventValidString
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })
  })

  it("Check if value is not boolean", () => {
    const mockFormErrors = {}
    const mockShowError = {}
    const mockEvent = {
      target: {
        name: "description",
        value: 3
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "boolean", mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ description_rule: "integer-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: true })
  })

  it("Check if value is boolean", () => {
    const mockFormErrors = { description_rule: "boolean-field" }
    const mockShowError = {}
    const mockEventValid = {
      target: {
        name: "description",
        value: true
      }
    }
    checkFormRules(mockFormErrors, mockShowError, true, mockSetShowError, mockSetFormErrors, "boolean", mockEventValid)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })

    const mockEventValidString = {
      target: {
        name: "description",
        value: "true"
      }
    }
    checkFormRules(
      mockFormErrors,
      mockShowError,
      true,
      mockSetShowError,
      mockSetFormErrors,
      "boolean",
      mockEventValidString
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_rule: false })
  })
})
