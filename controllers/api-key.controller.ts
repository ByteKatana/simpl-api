import { connectDB } from "../lib/mongodb"
import { Collection, DeleteResult, Filter, InsertOneResult, MongoClient, ObjectId } from "mongodb"

//Interface
import { ApiKey } from "../interfaces"

//===============================================

export class apiKeyController {
  apiKey: ApiKey

  constructor(apiKey: ApiKey) {
    this.apiKey = apiKey
  }

  async findKey() {
    let dbCollection: Collection
    let isConnected = false
    let client: MongoClient

    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (isConnected) {
        let findResult: Filter<object>
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys") as Collection
          findResult = await dbCollection.find({ key: this.apiKey.key }).toArray()
        } catch (e) {
          console.log(e)
        }
        return findResult
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (client?.close && typeof client.close === "function") {
        await client.close()
      }
    }
  }

  async create() {
    let dbCollection: Collection
    let isConnected = false
    let client: MongoClient

    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (isConnected) {
        let insertResult: InsertOneResult
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys")
          insertResult = await dbCollection.insertOne(this.apiKey)
        } catch (e) {
          console.log(e)
        }

        if (insertResult.insertedId) {
          return { status: "success", message: "API Key has been generated.", keyId: insertResult.insertedId }
        } else {
          return { status: "failed", message: "Failed to create the api key." }
        }
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (client?.close && typeof client.close === "function") {
        await client.close()
      }
    }
  }

  async delete(id: string) {
    let client: MongoClient
    let dbCollection: Collection
    let isConnected = false

    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (isConnected) {
        let deleteResult: DeleteResult
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys")
          deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
          console.log("deleteResult:", deleteResult, "Error:", e) //TODO: better error logging & displaying
        }
        if (deleteResult.deletedCount === 1) {
          return { status: "success", message: "API Key has been removed." }
        } else {
          return { status: "failed", message: "Failed to delete the api key." }
        }
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.log(e) //TODO: better error logging & displaying
    } finally {
      if (client?.close && typeof client.close === "function") {
        await client.close()
      }
    }
  }
}
