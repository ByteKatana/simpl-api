import { MongoClient } from "mongodb"

let dbUri: string = `${process.env.MONGODB_CONNECTION_STRING}`
//let dbName: string = "api_db"
let clientPromise
if (!dbUri) throw new Error("Please define the MongoDB Connection String inside .env file")
//if(!dbName) throw new Error('Please define the MongoDB database name inside .env file')

export async function connectDB() {
	const client = await MongoClient.connect(dbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	clientPromise = await client.connect()

	return clientPromise
}

export default clientPromise
