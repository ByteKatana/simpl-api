import { connectDB } from "../lib/mongodb"
import { ObjectId, MongoClient, Collection, UpdateResult, DeleteResult, InsertOneResult } from "mongodb"
import bcrypt from "bcryptjs"

//Interface
import { User } from "../interfaces"

export class UserController {
  user: User
  mockClient: boolean

  constructor(userData: User, mockClient?: boolean) {
    this.user = userData
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
        const plainPw = this.user.password
        const hashPw = bcrypt.hashSync(plainPw, 8)
        dbCollection = client.db(process.env.DB_NAME).collection("users")
        insertResult = await dbCollection.insertOne({ ...this.user, password: hashPw })

        if (insertResult.insertedId) {
          if (this.mockClient) {
            return { result: { status: "success", message: "User has been created." }, userId: insertResult.insertedId }
          }

          return { status: "success", message: "User has been created." }
        } else {
          return { status: "failed", message: "Failed to create the user." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the user." }
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
        let lastPw = this.user.password
        if (this.user.pwchanged) {
          lastPw = bcrypt.hashSync(lastPw, 8)
        }
        dbCollection = client.db(process.env.DB_NAME).collection("users")
        updateResult = await dbCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              username: this.user.username,
              email: this.user.email,
              password: lastPw,
              permission_group: this.user.permission_group
            }
          },
          { upsert: false }
        )
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (updateResult["matchedCount"] === 1 && updateResult["modifiedCount"] === 1) {
        return { status: "success", message: "User has been updated." }
      } else if (updateResult["matchedCount"] === 1 && updateResult["modifiedCount"] === 0) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the user." }
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
        dbCollection = client.db(process.env.DB_NAME).collection("users")
        deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (deleteResult.deletedCount === 1) {
        return { status: "success", message: "User has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the user." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
