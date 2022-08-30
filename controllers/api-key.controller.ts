import { NextApiResponse, NextApiRequest } from "next"
import { connectDB } from "../lib/mongodb.ts"
import { ObjectId } from "mongodb"

//Interface
import { ApiKey } from "../interfaces"
//===============================================

export class apiKeyController {
	constructor(apiKey: ApiKey) {
		this.apiKey = apiKey
	}

	async findKey() {
		let dbCollection
		let isConnected: boolean = false
		let client

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.error(e)
		}
		if (isConnected) {
			let findResult
			try {
				dbCollection = client.db(process.env.DB_NAME).collection<ApiKey>("api_keys")
				findResult = await dbCollection.find({ key: `${this.apiKey.key}` }).toArray()
			} catch (e) {
				console.log(e)
			}
			return findResult
		} else {
			return [{ message: "Database connection is NOT established" }]
		}
	}

	async create() {
		let dbCollection
		let isConnected: boolean = false
		let client

		try {
			client = await connectDB()
			isConnected = true
		} catch (e) {
			console.error(e)
		}
		if (isConnected) {
			let insertResult
			try {
				dbCollection = client.db(process.env.DB_NAME).collection<ApiKey>("api_keys")
				insertResult = await dbCollection.insertOne(this.apiKey)
			} catch (e) {
				console.log(e)
			}

			if (insertResult.insertedId) {
				return { status: "success", message: "API Key has been generated." }
			} else {
				return { status: "failed", message: "Failed to create the api key." }
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
				dbCollection = client.db(process.env.DB_NAME).collection("api_keys")
				deleteResult = await dbCollection.deleteOne({ _id: ObjectId(id) })
			} catch (e) {
				console.log(e)
			}
			if (deleteResult.deletedCount === 1) {
				return { status: "success", message: "API Key has been removed." }
			} else {
				return { status: "failed", message: "Failed to delete the api key." }
			}
		} else {
			return [{ message: "Database connection is NOT established" }]
		}
	}
}
