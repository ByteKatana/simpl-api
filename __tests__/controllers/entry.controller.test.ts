import "@testing-library/jest-dom"
import { Entry } from "../../interfaces"
import { EntryController } from "../../controllers/entry.controller"

describe("Check if entry controller handles action properly", () => {
  let entryController: EntryController
  let entryData: Entry
  let entryId: string

  afterAll(() => {
    jest.clearAllMocks()
  })

  it("Check if entry created properly", async () => {
    entryData = {
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry"
    }
    entryController = new EntryController(entryData, true)
    const createEntry = await entryController.create()

    expect(createEntry.result).toEqual({ status: "success", message: "Entry has been created." })
    entryId = createEntry.entryId
  })
  it("Check if entry updated properly", async () => {
    entryData = {
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1"
    }
    entryController = new EntryController(entryData, true)
    const updateEntry = await entryController.update(entryId)

    expect(updateEntry).toEqual({ status: "success", message: "Entry has been updated." })
  })
  it("Check if entry deleted properly", async () => {
    entryData = {
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1"
    }
    entryController = new EntryController(entryData, true)
    const deleteEntry = await entryController.delete(entryId)

    expect(deleteEntry).toEqual({ status: "success", message: "Entry has been deleted." })
  })
})
