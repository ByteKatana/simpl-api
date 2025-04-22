import "@testing-library/jest-dom"
import isDouble from "../../../lib/ui/is-double"

describe("Check if value is Double", () => {
  it("Return True if value is double", () => {
    const value = isDouble(2.4)
    expect(value).toBe(true)
  })

  it("Return False if value is not double", () => {
    const value = isDouble(2)
    expect(value).toBe(false)
  })

  it("Return False if value is not number", () => {
    const stringDouble = isDouble("2.5")
    expect(stringDouble).toBe(false)

    const valueBoolean = isDouble(true)
    expect(valueBoolean).toBe(false)

    const valueStringBoolean = isDouble("true")
    expect(valueStringBoolean).toBe(false)

    const valueString = isDouble("anything")
    expect(valueString).toBe(false)

    const valueArray = isDouble([1.4, 1.5])
    expect(valueArray).toBe(false)

    const valueObject = isDouble({ first: 2.5 })
    expect(valueObject).toBe(false)

    const valueFn = isDouble(jest.fn())
    expect(valueFn).toBe(false)
  })
})
