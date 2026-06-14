//Core
import { NextApiResponse, NextApiRequest } from "next"

//DB
import { connectDB } from "../../../../lib/mongodb"
import { Collection, Db, MongoClient } from "mongodb"
//Controller
import { UserController } from "../../../../controllers/user.controller"
import { PermissionGroupController } from "../../../../controllers/permission-group.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { secretkey } = _req.query
  if (process.env.SECRET_KEY === secretkey) {
    let dbConnection: Db
    let isConnected = false
    let client: MongoClient

    try {
      client = await connectDB()
      isConnected = true
    } catch (e) {
      console.error(e)
    }
    let apiKeysResult: Collection
    let entriesResult: Collection
    let entryTypesResult: Collection
    let permissionGroupsResult: Collection
    let usersResult: Collection
    let accountResult
    let rootGroupResult
    let adminGroupResult
    let viewerGroupResult
    let newPW: string
    if (isConnected) {
      try {
        //Creating collections
        dbConnection = client.db(process.env.DB_NAME)
        apiKeysResult = await dbConnection.createCollection("api_keys")
        entriesResult = await dbConnection.createCollection("entries")
        entryTypesResult = await dbConnection.createCollection("entry_types")
        permissionGroupsResult = await dbConnection.createCollection("permission_groups")
        usersResult = await dbConnection.createCollection("users")

        //Creating Admin Account
        newPW = Math.random().toString(36).slice(2)
        const UserData = new UserController(
          {
            username: "admin",
            password: newPW,
            email: "admin@localhost.test",
            permission_group: "root"
          },
          false
        )
        accountResult = await UserData.create()

        const RootPermissionGroupData = new PermissionGroupController(
          {
            name: "root",
            slug: "root",
            privileges: [
              {
                "system.entry_types": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.entries": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.users": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.permission_groups": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.settings": {
                  permissions: ["read", "update", "delete", "create"]
                }
              }
            ]
          },
          false
        )
        rootGroupResult = await RootPermissionGroupData.create()

        const AdminPermissionGroupData = new PermissionGroupController(
          {
            name: "admin",
            slug: "admin",
            privileges: [
              {
                "system.entry_types": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.entries": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.users": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.permission_groups": {
                  permissions: ["read", "update", "delete", "create"]
                }
              },
              {
                "system.settings": {
                  permissions: ["read", "update", "delete", "create"]
                }
              }
            ]
          },
          false
        )
        adminGroupResult = await AdminPermissionGroupData.create()

        const ViewerPermissionGroupData = new PermissionGroupController(
          {
            name: "Viewer",
            slug: "viewer",
            privileges: []
          },
          false
        )
        viewerGroupResult = await ViewerPermissionGroupData.create()
      } catch (e) {
        console.log(e)
      }
    }
    if (
      apiKeysResult !== undefined &&
      entriesResult !== undefined &&
      entryTypesResult !== undefined &&
      permissionGroupsResult !== undefined &&
      usersResult !== undefined &&
      accountResult.status === "success" &&
      rootGroupResult.status === "success" &&
      adminGroupResult.status === "success" &&
      viewerGroupResult.status === "success"
    ) {
      res.status(200).json({
        collectionsCreated: true,
        collectionsCreatedMsg: "Collections has been created",
        adminCreated: true,
        adminCreatedMsg: "Admin Account has been created",
        adminAccountDetails: { username: "admin", email: "admin@localhost.test", password: newPW }
      })
    } else {
      res.status(200).json({ message: "Installation failed! Check your console log!" })
    }
    //res.status(200).json({ message: "OK!" })
  }
  res.status(401).json({ message: "You're not authorized!" })
}
