//Database
import { prisma } from "@/lib/prisma"
import { Entry as PrismaEntry, Prisma } from "@/prisma-client/client"

//Interface
import { Entry } from "@/interfaces/entry"

export class EntryController {
  entry: Entry
  mockClient: boolean
  constructor(entryData: Entry, mockClient: boolean) {
    this.entry = entryData
    this.mockClient = mockClient
  }

  async create() {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let insertResult: PrismaEntry | undefined
      try {
        const dataToInsert: Prisma.EntryCreateInput = {
          data: this.entry.data as any,
          name: this.entry.name,
          namespace: this.entry.namespace,
          slug: this.entry.slug,
          status: this.entry.status,
          updated_at: this.entry.updated_at ? new Date(this.entry.updated_at).toISOString() : new Date().toISOString()
        }

        if (this.entry._id) {
          dataToInsert.id = this.entry._id.toString()
        }

        insertResult = await prisma.entry.create({
          data: dataToInsert
        })

        if (insertResult && insertResult.id) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Entry has been created." },
              entryId: insertResult.id
            }
          }

          return { status: "success", message: "Entry has been created." }
        } else {
          return { status: "failed", message: "Failed to create the entry." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the entry." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async update(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let updateResult: PrismaEntry | undefined
      let isDifferent = false
      try {
        const prevState = await prisma.entry.findUnique({
          where: { id: id }
        })

        if (prevState) {
          isDifferent =
            prevState.name !== this.entry.name ||
            prevState.namespace !== this.entry.namespace ||
            prevState.slug !== this.entry.slug ||
            prevState.status !== this.entry.status ||
            JSON.stringify(prevState.data) !== JSON.stringify(this.entry.data)
        }

        updateResult = await prisma.entry.update({
          where: { id: id },
          data: {
            data: this.entry.data as any,
            name: this.entry.name,
            namespace: this.entry.namespace,
            slug: this.entry.slug,
            status: this.entry.status,
            updated_at: this.entry.updated_at ? new Date(this.entry.updated_at).toISOString() : new Date().toISOString()
          }
        })
      } catch (e) {
        console.log(e)
      }
      if (updateResult && isDifferent) {
        return { status: "success", message: "Entry has been updated." }
      } else if (updateResult && !isDifferent) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the entry." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async delete(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let deleteResult: Prisma.BatchPayload | undefined
      try {
        deleteResult = await prisma.entry.deleteMany({
          where: { id: id }
        })
      } catch (e) {
        console.log(e)
      }
      if (deleteResult && deleteResult.count === 1) {
        return { status: "success", message: "Entry has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the entry." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
