import "@testing-library/jest-dom"
import { ObjectId } from "mongodb"
import { getByLimit } from "../../lib/get-by-limit"

const mockData = [
  {
    _id: new ObjectId("67eab9779f9cf2a516690252"),
    name: "drinks",
    namespace: "drinks",
    slug: "drinks",
    fields: [
      {
        calories: {
          value_type: "number",
          form_type: "input",
          length: "5"
        },
        ingredients: {
          value_type: "string",
          form_type: "textarea",
          length: "500"
        }
      }
    ]
  },
  {
    _id: new ObjectId("67eab1239f9cf2a516690252"),
    name: "juices",
    namespace: "drinks.juices",
    slug: "juices",
    fields: [
      {
        calories: {
          value_type: "number",
          form_type: "input",
          length: "5"
        },
        prep_time_minute: {
          value_type: "number",
          form_type: "input",
          length: "5"
        },
        ingredients: {
          value_type: "string",
          form_type: "textarea",
          length: "500"
        }
      }
    ]
  },
  {
    _id: new ObjectId("67eab1239f9cf2a516690252"),
    name: "Languages",
    namespace: "languages",
    slug: "languages",
    fields: [
      {
        name: {
          value_type: "string",
          form_type: "input",
          length: "99"
        },
        code: {
          value_type: "string",
          form_type: "input",
          length: "3"
        }
      }
    ]
  }
]

describe("Return by given limit argument", () => {
  it("Check if limit value is NaN", () => {
    const limEl = getByLimit("first_x", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value's length is less than two", () => {
    const limEl = getByLimit("x", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value's length is grater than two", () => {
    const limEl = getByLimit("last_1_x", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value is equal to zero", () => {
    const limEl = getByLimit("random_0", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value is less than zero", () => {
    const limEl = getByLimit("random_-2", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value is empty string", () => {
    const limEl = getByLimit("random_''", mockData)
    expect(limEl).toHaveProperty("message")
    expect(limEl.message).toBe("Invalid limit value")
  })

  it("Check if the limit value is valid and return first given amount of elements", () => {
    const limEl = getByLimit("first_2", mockData)
    expect(Array.isArray(limEl)).toBe(true)
    expect(limEl.length).toBe(2)
    expect(limEl[0]).toHaveProperty("name")
    expect(limEl[0]).toHaveProperty("namespace")
    expect(limEl[0]).toHaveProperty("fields")
    expect(Array.isArray(limEl[0].fields)).toBe(true)
    expect(limEl[0].fields.length).toBeGreaterThanOrEqual(1)
  })

  it("Check if the limit value is valid and return last given amount of elements", () => {
    const limEl = getByLimit("last_2", mockData)
    expect(Array.isArray(limEl)).toBe(true)
    expect(limEl.length).toBe(2)
    expect(limEl[0]).toHaveProperty("name")
    expect(limEl[0]).toHaveProperty("namespace")
    expect(limEl[0]).toHaveProperty("fields")
    expect(Array.isArray(limEl[0].fields)).toBe(true)
    expect(limEl[0].fields.length).toBeGreaterThanOrEqual(1)
  })

  it("Check if the limit value is valid and return random given amount of elements", () => {
    const limEl = getByLimit("random_2", mockData)
    expect(Array.isArray(limEl)).toBe(true)
    expect(limEl.length).toBe(2)
    expect(limEl[0]).toHaveProperty("name")
    expect(limEl[0]).toHaveProperty("namespace")
    expect(limEl[0]).toHaveProperty("fields")
    expect(Array.isArray(limEl[0].fields)).toBe(true)
    expect(limEl[0].fields.length).toBeGreaterThanOrEqual(1)
  })
})
