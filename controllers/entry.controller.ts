//Database
import { connectDB } from "../lib/mongodb.ts"
import { ObjectId } from "mongodb"

//Interface
import { Entry } from "../interfaces"

export class EntryController {
	constructor(entryData: Entry) {
		this.entry = entryData
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
				dbCollection = client.db(process.env.DB_NAME).collection<Entry>("entries")
				insertResult = await dbCollection.insertOne(this.entry)
			} catch (e) {
				console.log(e)
			}
			if (insertResult.insertedId) {
				return { status: "success", message: "Entry has been created." }
			} else {
				return { status: "failed", message: "Failed to create the entry." }
			}
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
				dbCollection = client.db(process.env.DB_NAME).collection<Entry>("entries")
				updateResult = await dbCollection.updateOne(
					{ _id: ObjectId(id) },
					{ $set: this.entry },
					{ upsert: false }
				)
			} catch (e) {
				console.log(e)
			}
			if (updateResult["modifiedCount"] === 1) {
				return { status: "success", message: "Entry has been updated." }
			} else if (updateResult["matchedCount"] === 1 && updateResult["modifiedCount"] === 0) {
				return { status: "failed", message: "You didn't make any change." }
			} else {
				return { status: "failed", message: "Failed to update the entry." }
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
				dbCollection = client.db(process.env.DB_NAME).collection("entries")
				deleteResult = await dbCollection.deleteOne({ _id: ObjectId(id) })
			} catch (e) {
				console.log(e)
			}
			if (deleteResult.deletedCount === 1) {
				return { status: "success", message: "Entry has been deleted." }
			} else {
				return { status: "failed", message: "Failed to delete the entry." }
			}
		} else {
			return [{ message: "Database connection is NOT established" }]
		}
	}
}
