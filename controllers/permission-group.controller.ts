//Database
import { connectDB } from "../lib/mongodb"
import { ObjectId } from "mongodb"

//Interface
import { PermissionGroup } from "../interfaces"
//===============================================

export class PermissionGroupController {
	permissionGroup: PermissionGroup

	constructor(permissionGroupData: PermissionGroup) {
		this.permissionGroup = permissionGroupData
	}

	async create() {
		let client
		let dbCollection
		let isConnected: boolean = false

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.log(e)
		}

		if (isConnected) {
			let insertResult
			try {
				dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
				insertResult = await dbCollection.insertOne(this.permissionGroup)
			} catch (e) {
				console.log(e)
			}
			if (insertResult.insertedId) {
				return { status: "success", message: "Permission group has been created." }
			} else {
				return { status: "failed", message: "Failed to create the permission group." }
			}
		} else {
			return [{ message: "Database connection is NOT established" }]
		}
	}

	async update(id: string) {
		let client
		let dbCollection
		let isConnected: boolean = false

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.log(e)
		}
		if (isConnected) {
			let updateResult
			try {
				dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
				updateResult = await dbCollection.updateOne(
					{ _id: new ObjectId(id) },
					{ $set: this.permissionGroup },
					{ upsert: false }
				)
			} catch (e) {
				console.log(e)
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
		let client
		let dbCollection
		let isConnected: boolean = false

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.log(e)
		}
		if (isConnected) {
			let deleteResult
			try {
				dbCollection = client.db(process.env.DB_NAME).collection("permission_groups")
				deleteResult = await dbCollection.deleteOne({ _id: new ObjectId(id) })
			} catch (e) {
				console.log(e)
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
