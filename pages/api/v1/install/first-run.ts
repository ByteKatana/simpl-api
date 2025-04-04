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
    let adminGroupResult
    let memberGroupResult
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
        let UserData = new UserController({
          username: "admin",
          password: newPW,
          email: "admin@localhost.test",
          permission_group: "admin"
        })
        accountResult = await UserData.create()

        let AdminPermissionGroupData = new PermissionGroupController({
          name: "Admin",
          slug: "admin",
          privileges: []
        })
        adminGroupResult = await AdminPermissionGroupData.create()

        let MemberPermissionGroupData = new PermissionGroupController({
          name: "Member",
          slug: "member",
          privileges: []
        })
        memberGroupResult = await MemberPermissionGroupData.create()
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
      adminGroupResult.status === "success" &&
      memberGroupResult.status === "success"
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
  res.status(200).json({ message: "You're not authorized!" })
}
