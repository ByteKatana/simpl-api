//Database
import { connectDB } from "../lib/mongodb"
import { ObjectId, MongoClient, Collection, UpdateResult } from "mongodb"

//Interface
import { EntryType } from "../interfaces"
//===============================================

export class EntryTypeController {
  entryType: EntryType
  mockClient: boolean

  constructor(entryTypeData: EntryType, mockClient: boolean) {
    this.entryType = entryTypeData
    this.mockClient = mockClient
  }

  async create() {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected = false

    try {
      client = await connectDB(this.mockClient)
      isConnected = true
    } catch (e) {
      console.log(e)
    }

    if (isConnected) {
      let insertResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        insertResult = await dbCollection.insertOne(this.entryType)

        if (insertResult.insertedId) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Entry Type has been created." },
              entryTypeId: insertResult.insertedId
            }
          }
          return { status: "success", message: "Entry Type has been created." }
        } else {
          return { status: "failed", message: "Failed to create the entry type." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the entry type." }
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async update(id: string) {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected = false

    try {
      client = await connectDB(this.mockClient)
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (isConnected) {
      let updateResult: UpdateResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        updateResult = await dbCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: this.entryType },
          { upsert: false }
        )
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (updateResult.modifiedCount === 1) {
        return { status: "success", message: "Entry Type has been updated." }
      } else if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 0) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the entry type." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async delete(id: string) {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected = false

    try {
      client = await connectDB(this.mockClient)
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (isConnected) {
      let deleteResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (deleteResult.deletedCount === 1) {
        return { status: "success", message: "Entry Type has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the entry type." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
