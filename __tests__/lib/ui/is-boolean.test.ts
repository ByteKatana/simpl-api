import "@testing-library/jest-dom"
import isBoolean from "../../../lib/ui/is-boolean"

describe("Check if string value is boolean", () => {
  it("Return True if value is boolean", () => {
    const valueTrue = isBoolean("true")
    expect(valueTrue).toBe(true)

    const valueFalse = isBoolean("false")
    expect(valueFalse).toBe(true)
  })

  it("Return False if value is boolean", () => {
    const value = isBoolean("value")
    expect(value).toBe(false)
  })
})
