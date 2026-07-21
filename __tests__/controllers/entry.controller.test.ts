import "@testing-library/jest-dom"
import { Entry, PublishStatus } from "@/interfaces"
import { EntryController } from "@/controllers/entry.controller"
import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"

// Mock the prisma module
jest.mock("@/lib/prisma")

describe("Check if the entry controller handles actions properly", () => {
  let entryController: EntryController
  let entryData: Entry
  let entryId: string

  // Get typed mock references to avoid inline type assertions and leading semicolons
  const mockPrismaEntryCreate = prisma.entry.create as jest.Mock
  const mockPrismaEntryFindUnique = prisma.entry.findUnique as jest.Mock
  const mockPrismaEntryUpdate = prisma.entry.update as jest.Mock
  const mockPrismaEntryDeleteMany = prisma.entry.deleteMany as jest.Mock

  beforeEach(() => {
    entryId = new ObjectId().toString()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("Check if entry created properly", async () => {
    entryData = {
      _id: entryId,
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry",
      status: PublishStatus.Draft,
      data: {},
      created_at: new Date(),
      updated_at: new Date()
    }

    mockPrismaEntryCreate.mockResolvedValue({
      id: entryId,
      ...entryData,
      created_at: entryData.created_at?.toISOString(),
      updated_at: entryData.updated_at?.toISOString()
    })

    entryController = new EntryController(entryData, true)
    const createEntry = (await entryController.create()) as {
      result: { status: string; message: string }
      entryId: string
    }

    expect(mockPrismaEntryCreate).toHaveBeenCalledWith({
      data: {
        id: entryId,
        data: entryData.data,
        name: entryData.name,
        namespace: entryData.namespace,
        slug: entryData.slug,
        status: entryData.status,
        updated_at: entryData.updated_at ? new Date(entryData.updated_at).toISOString() : expect.any(String)
      }
    })

    expect(createEntry.result).toEqual({ status: "success", message: "Entry has been created." })
    expect(createEntry.entryId).toBe(entryId)
  })

  it("Check if entry updated properly", async () => {
    entryData = {
      _id: entryId,
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1",
      status: PublishStatus.Draft,
      data: {},
      created_at: new Date(),
      updated_at: new Date()
    }

    mockPrismaEntryFindUnique.mockResolvedValue({
      id: entryId,
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry",
      status: PublishStatus.Draft,
      data: {},
      created_at: entryData.created_at?.toISOString(),
      updated_at: entryData.updated_at?.toISOString()
    })

    mockPrismaEntryUpdate.mockResolvedValue({
      id: entryId,
      ...entryData,
      created_at: entryData.created_at?.toISOString(),
      updated_at: entryData.updated_at?.toISOString()
    })

    entryController = new EntryController(entryData, true)
    const updateEntry = await entryController.update(entryId)

    expect(mockPrismaEntryFindUnique).toHaveBeenCalledWith({
      where: { id: entryId }
    })

    expect(mockPrismaEntryUpdate).toHaveBeenCalledWith({
      where: { id: entryId },
      data: {
        data: entryData.data,
        name: entryData.name,
        namespace: entryData.namespace,
        slug: entryData.slug,
        status: entryData.status,
        updated_at: entryData.updated_at ? new Date(entryData.updated_at).toISOString() : expect.any(String)
      }
    })

    expect(updateEntry).toEqual({ status: "success", message: "Entry has been updated." })
  })

  it("Check if entry update detects no-changes and returns appropriately", async () => {
    entryData = {
      _id: entryId,
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry",
      status: PublishStatus.Draft,
      data: {},
      created_at: new Date(),
      updated_at: new Date()
    }

    mockPrismaEntryFindUnique.mockResolvedValue({
      id: entryId,
      name: "mock entry",
      namespace: "mock-type",
      slug: "mock-entry",
      status: PublishStatus.Draft,
      data: {},
      created_at: entryData.created_at?.toISOString(),
      updated_at: entryData.updated_at?.toISOString()
    })

    mockPrismaEntryUpdate.mockResolvedValue({
      id: entryId,
      ...entryData,
      created_at: entryData.created_at?.toISOString(),
      updated_at: entryData.updated_at?.toISOString()
    })

    entryController = new EntryController(entryData, true)
    const updateEntry = await entryController.update(entryId)

    expect(mockPrismaEntryFindUnique).toHaveBeenCalledWith({
      where: { id: entryId }
    })

    expect(updateEntry).toEqual({ status: "failed", message: "You didn't make any change." })
  })

  it("Check if entry deleted properly", async () => {
    entryData = {
      _id: entryId,
      name: "mock entry1",
      namespace: "mock-type",
      slug: "mock-entry1",
      status: PublishStatus.Draft,
      data: {},
      created_at: new Date(),
      updated_at: new Date()
    }

    mockPrismaEntryDeleteMany.mockResolvedValue({
      count: 1
    })

    entryController = new EntryController(entryData, true)
    const deleteEntry = await entryController.delete(entryId)

    expect(mockPrismaEntryDeleteMany).toHaveBeenCalledWith({
      where: { id: entryId }
    })

    expect(deleteEntry).toEqual({ status: "success", message: "Entry has been deleted." })
  })
})
