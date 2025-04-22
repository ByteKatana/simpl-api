import "@testing-library/jest-dom"
import checkLength from "../../../lib/ui/check-length"

const mockSetFormErrors = jest.fn()
const mockSetShowError = jest.fn()

describe("Check length of the value", () => {
  it("Check If the length is greater than given length", () => {
    const mockFormErrors = {}
    const mockEvent = {
      target: {
        name: "description",
        value: "Lorem ipsum dolor sit amet"
      }
    }
    checkLength(mockFormErrors, mockSetFormErrors, mockSetShowError, 5, mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({ description_length: "length-error" })
    expect(mockSetShowError).toHaveBeenCalledWith({ description_length: true })
  })

  it("Check If the length is less than given length", () => {
    const mockFormErrors = { description_length: "length-error" }
    const mockEvent = {
      target: {
        name: "description",
        value: "Lorem ipsum dolor sit amet"
      }
    }
    checkLength(mockFormErrors, mockSetFormErrors, mockSetShowError, 500, mockEvent)
    expect(mockSetFormErrors).toHaveBeenCalledWith({})
    expect(mockSetShowError).toHaveBeenCalledWith({ description_length: false })
  })
})
