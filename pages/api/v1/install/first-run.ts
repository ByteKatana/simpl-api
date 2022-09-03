//Core
import { NextApiResponse, NextApiRequest } from "next"

//DB
import { connectDB } from "../../../../lib/mongodb"

//Controller
import { UserController } from "../../../../controllers/user.controller"
import { PermissionGroupController } from "../../../../controllers/permission-group.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const { secretkey } = _req.query
	if (process.env.SECRET_KEY === secretkey) {
		let dbConnection
		let isConnected: boolean = false
		let client

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.error(e)
		}
		let apiKeysResult
		let entriesResult
		let entryTypesResult
		let permissionGroupsResult
		let usersResult
		let accountResult
		let adminGroupResult
		let memberGroupResult
		let newPW
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
			return res.status(200).json({
				collectionsCreated: true,
				collectionsCreatedMsg: "Collections has been created",
				adminCreated: true,
				adminCreatedMsg: "Admin Account has been created",
				adminAccountDetails: { username: "admin", email: "admin@localhost.test", password: newPW }
			})
		} else {
			return res.status(200).json({ message: "Installation failed! Check your console log!" })
		}
		//return res.status(200).json({ message: "OK!" })
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
