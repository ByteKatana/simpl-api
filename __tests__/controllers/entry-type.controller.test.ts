import "@testing-library/jest-dom"
import { EntryType } from "../../interfaces"
import { EntryTypeController } from "../../controllers/entry-type.controller"

describe("Check if the entry type controller handles actions properly", () => {
  let entryTypeController: EntryTypeController
  let entryTypeData: EntryType
  let entryTypeId: string

  afterAll(() => {
    jest.clearAllMocks()
  })

  it("Check if entry type created properly", async () => {
    entryTypeData = {
      name: "mock type",
      namespace: "mock-type",
      fields: []
    }
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const createEntryType = await entryTypeController.create()

    expect(createEntryType.result).toEqual({ status: "success", message: "Entry Type has been created." })
    entryTypeId = createUser.entryTypeId
  })
  it("Check if entry type updated properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      fields: []
    }
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const updateEntryType = await entryTypeController.update(entryTypeId)

    expect(updateEntryType).toEqual({ status: "success", message: "Entry Type has been updated." })
  })
  it("Check if entry type deleted properly", async () => {
    entryTypeData = {
      name: "mock type1",
      namespace: "mock-type1",
      fields: []
    }
    entryTypeController = new EntryTypeController(entryTypeData, true)
    const deleteEntryType = await entryTypeController.delete(entryTypeId)

    expect(deleteEntryType).toEqual({ status: "success", message: "Entry Type has been deleted." })
  })
})
