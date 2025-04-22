//Database
import { connectDB } from "../lib/mongodb"
import { ObjectId, MongoClient, Collection, UpdateResult, DeleteResult, InsertOneResult } from "mongodb"

//Interface
import { PermissionGroup } from "../interfaces"
//===============================================

export class PermissionGroupController {
  permissionGroup: PermissionGroup
  mockClient: boolean

  constructor(permissionGroupData: PermissionGroup, mockClient: boolean) {
    this.permissionGroup = permissionGroupData
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
        dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
        insertResult = await dbCollection.insertOne(this.permissionGroup)

        if (insertResult.insertedId) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Permission group has been created." },
              permGroupId: insertResult.insertedId
            }
          }

          return { status: "success", message: "Permission group has been created." }
        } else {
          return { status: "failed", message: "Failed to create the permission group." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the permission group." }
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
        dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
        updateResult = await dbCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: this.permissionGroup },
          { upsert: false }
        )
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (updateResult["modifiedCount"] === 1) {
        return { status: "success", message: "Permission group has been updated." }
      } else if (updateResult["matchedCount"] === 1 && updateResult["modifiedCount"] === 0) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the permission group." }
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
        dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
        deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }
      if (deleteResult.deletedCount === 1) {
        return { status: "success", message: "Permission group has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the permission group." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
