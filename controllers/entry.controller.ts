//Database
import { connectDB } from "../lib/mongodb"
import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb"

//Interface
import { Entry } from "../interfaces"

export class EntryController {
  entry: Entry
  mockClient: boolean
  constructor(entryData: Entry, mockClient: boolean) {
    this.entry = entryData
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
      let insertResult: InsertOneResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entries")
        insertResult = await dbCollection.insertOne(this.entry)
        if (insertResult.insertedId) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Entry has been created." },
              entryId: insertResult.insertedId
            }
          }

          return { status: "success", message: "Entry has been created." }
        } else {
          return { status: "failed", message: "Failed to create the entry." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the entry." }
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
        dbCollection = client.db(process.env.DB_NAME).collection("entries")
        updateResult = await dbCollection.updateOne({ _id: new ObjectId(id) }, { $set: this.entry }, { upsert: false })
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (updateResult.modifiedCount === 1) {
        return { status: "success", message: "Entry has been updated." }
      } else if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 0) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the entry." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async delete(id: string) {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected: boolean = false

    try {
      client = await connectDB(this.mockClient)
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (isConnected) {
      let deleteResult: DeleteResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entries")
        deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (deleteResult.deletedCount === 1) {
        return { status: "success", message: "Entry has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the entry." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
