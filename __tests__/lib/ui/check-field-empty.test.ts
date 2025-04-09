import "@testing-library/jest-dom"
import React from "react"
import checkFieldEmpty from "../../../lib/ui/check-field-empty"

const mockSetFormErrors: React.Dispatch<React.SetStateAction<T>> = jest.fn()
const mockSetShowError: React.Dispatch<React.SetStateAction<T>> = jest.fn()

//jest.spyOn(React, "useState").mockImplementation(<T>(formErrors: T) => [formErrors, mockSetFormErrors])

describe("Check if input field empty", () => {
  it("Check if target value is empty", () => {
    const mockFormErrors = {}
    const mockShowError = {}
    const mockEvent = {
      target: {
        name: "fruit",
        value: ""
      }
    }
    //if index is undefined
    const dummyField = checkFieldEmpty(mockFormErrors, mockShowError, mockSetFormErrors, mockSetShowError, mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ fruit: "empty-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ fruit: true })

    //if index is defined
    const dummyFieldIndexed = checkFieldEmpty(
      mockFormErrors,
      mockShowError,
      mockSetFormErrors,
      mockSetShowError,
      mockEvent,
      1
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({ fruit_1: "empty-field" })
    expect(mockSetShowError).toHaveBeenCalledWith({ fruit_1: true })
  })

  it("Check if target value is not empty anymore", () => {
    const mockFormErrorsP = { fruit: "empty-field" }
    const mockShowErrorP = { fruit: true }
    const mockEventP = {
      target: {
        name: "fruit",
        value: "orange"
      }
    }
    //if index is undefined
    const dummyField = checkFieldEmpty(mockFormErrorsP, mockShowErrorP, mockSetFormErrors, mockSetShowError, mockEventP)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ fruit: false })

    //if index is defined
    const mockFormErrorsPi = { fruit_1: "empty-field" }
    const mockShowErrorPi = { fruit_1: true }
    const dummyFieldIndexed = checkFieldEmpty(
      mockFormErrorsPi,
      mockShowErrorPi,
      mockSetFormErrors,
      mockSetShowError,
      mockEventP,
      1
    )
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ fruit_1: false })
  })
})
