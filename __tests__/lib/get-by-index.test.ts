import "@testing-library/jest-dom"
import { ObjectId } from "mongodb"
import { getByIndex } from "../../lib/get-by-index"

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
describe("Return by given index argument", () => {
  it("return the first element of the given array", () => {
    const firstElem = getByIndex("first", mockData)
    expect(firstElem.name).toBe("drinks")
  })

  it("return the last element of the given array", () => {
    const lastElem = getByIndex("last", mockData)
    expect(lastElem.name).toBe("Languages")
  })

  it("return a specific element of the given array by index", () => {
    const lastElem = getByIndex(2, mockData)
    expect(lastElem.name).toBe("juices")
  })

  it("return random element of the given array", () => {
    const randElem = getByIndex("random", mockData)

    //Check Name property
    expect(randElem).toHaveProperty("name")
    expect(randElem.name.length).toBeGreaterThanOrEqual(2)

    //Check Namespace property
    expect(randElem).toHaveProperty("namespace")
    expect(randElem.namespace.length).toBeGreaterThanOrEqual(2)

    //Check Slug property
    expect(randElem).toHaveProperty("slug")
    expect(randElem.slug.length).toBeGreaterThanOrEqual(2)

    //Check Field property
    expect(randElem).toHaveProperty("fields")
    expect(Array.isArray(randElem.fields)).toBe(true)
    expect(randElem.fields.length).toBeGreaterThanOrEqual(1)
  })
})
