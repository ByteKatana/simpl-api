import { connectDB } from "@/lib/mongodb"
import { Collection, DeleteResult, InsertOneResult, MongoClient, ObjectId } from "mongodb"

//Interface
import { ApiKey } from "@/interfaces"

//===============================================

export class apiKeyController {
  apiKey: Partial<ApiKey>

  constructor(apiKey: Partial<ApiKey>) {
    this.apiKey = apiKey
  }

  async findKey(): Promise<ApiKey[] | { message: string }[] | undefined> {
    let dbCollection: Collection<ApiKey>
    let isConnected = false
    let client: MongoClient | undefined
    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (client && isConnected) {
        let findResult: ApiKey[] | undefined
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys") as Collection<ApiKey>
          findResult = (await dbCollection.find({ key: this.apiKey.key }).toArray()) as ApiKey[]
        } catch (e) {
          console.log(e)
        }
        return findResult
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error(e)
    }
  }

  async create() {
    let dbCollection: Collection<any>
    let isConnected = false
    let client: MongoClient | undefined

    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (client && isConnected) {
        let insertResult: InsertOneResult | undefined
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys")
          insertResult = await dbCollection.insertOne(this.apiKey)
        } catch (e) {
          console.log(e)
        }

        if (insertResult && insertResult.insertedId) {
          return { status: "success", message: "API Key has been generated.", keyId: insertResult.insertedId }
        } else {
          return { status: "failed", message: "Failed to create the api key." }
        }
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error(e)
    }
  }

  async delete(id: string) {
    let client: MongoClient | undefined
    let dbCollection: Collection<any>
    let isConnected = false

    try {
      try {
        client = await connectDB()
        isConnected = true
      } catch (e) {
        console.log(e)
      }
      if (client && isConnected) {
        let deleteResult: DeleteResult | undefined
        try {
          dbCollection = client.db(process.env.DB_NAME).collection("api_keys")
          deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
        } catch (e) {
          console.error("Failed to delete API key:", e) //TODO: better error logging & displaying
        }
        if (deleteResult && deleteResult.deletedCount === 1) {
          return { status: "success", message: "API Key has been removed." }
        } else {
          return { status: "failed", message: "Failed to delete the api key." }
        }
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error("An error occurred while deleting the API key:", e) //TODO: better error logging & displaying
    }
  }
}
