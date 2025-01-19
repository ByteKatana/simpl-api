//Database
import { connectDB } from "../lib/mongodb"
import { ObjectId, MongoClient, Collection, UpdateResult } from "mongodb"

//Interface
import { EntryType } from "../interfaces"
//===============================================

export class EntryTypeController {
  entryType: EntryType

  constructor(entryTypeData: EntryType) {
    this.entryType = entryTypeData
  }

  async create() {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected = false

    try {
      client = await connectDB()
      isConnected = true
    } catch (e) {
      console.log(e)
    }

    if (isConnected) {
      let insertResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        insertResult = await dbCollection.insertOne(this.entryType)
      } catch (e) {
        console.log(e)
      }
      if (insertResult.insertedId) {
        return { status: "success", message: "Entry Type has been created." }
      } else {
        return { status: "failed", message: "Failed to create the entry type." }
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
      client = await connectDB()
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
      client = await connectDB()
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
