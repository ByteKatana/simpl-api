//Database
import { connectDB } from "../lib/mongodb"
import { Collection, InsertOneResult, MongoClient, ObjectId, UpdateResult } from "mongodb"

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
      let insertResult: InsertOneResult
      let addPrivileges: UpdateResult
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        insertResult = await dbCollection.insertOne(this.entryType)

        //add CRUD privileges to the user's permission group for this entry type
        dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
        const permGroupData = await dbCollection.findOne({ slug: this.entryType.createdBy })

        if (permGroupData && permGroupData.privileges) {
          permGroupData.privileges.push({
            [this.entryType.namespace.split(" ").join("-").toLowerCase()]: {
              permissions: ["read", "update", "delete", "create"]
            }
          })
          addPrivileges = await dbCollection.updateOne(
            { _id: new ObjectId(permGroupData._id) },
            { $set: permGroupData },
            { upsert: false }
          )
        }
        if (insertResult.insertedId && addPrivileges && addPrivileges.modifiedCount === 1) {
          if (this.mockClient) {
            return {
              result: { status: "success", message: "Entry Type has been created." },
              entryTypeId: insertResult.insertedId
            }
          }
          return { status: "success", message: "Entry Type has been created." }
        } else if (insertResult.insertedId && !addPrivileges) {
          // Entry type created but permission group not found or updated
          return { status: "failed", message: "Entry type created but failed to update permission group." }
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
      let addPrivileges: UpdateResult | undefined
      try {
        dbCollection = client.db(process.env.DB_NAME).collection("entry_types")
        const prevState = await dbCollection.findOne({ _id: new ObjectId(id) })

        updateResult = await dbCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: this.entryType },
          { upsert: false }
        )

        if (prevState && prevState.namespace !== this.entryType.namespace) {
          //add CRUD privileges to the user's permission group for this entry type
          dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")

          // Use createdBy from prevState if not provided in update payload
          const permGroupSlug = this.entryType.createdBy || prevState.createdBy

          if (permGroupSlug) {
            const permGroupData = await dbCollection.findOne({ slug: permGroupSlug })

            if (permGroupData && permGroupData.privileges) {
              permGroupData.privileges.push({
                [this.entryType.namespace.split(" ").join("-").toLowerCase()]: {
                  permissions: ["read", "update", "delete", "create"]
                }
              })
              addPrivileges = await dbCollection.updateOne(
                { _id: new ObjectId(permGroupData._id) },
                { $set: permGroupData },
                { upsert: false }
              )
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        if (client?.close && typeof client.close === "function") {
          await client.close()
        }
      }

      // Check if namespace changed and privileges were updated
      const namespaceChanged = addPrivileges !== undefined

      if (namespaceChanged && updateResult.modifiedCount === 1 && addPrivileges.modifiedCount === 1) {
        return { status: "success", message: "Entry Type has been updated." }
      } else if (!namespaceChanged && updateResult.modifiedCount === 1) {
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
