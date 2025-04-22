import { MongoClient } from "mongodb"

let dbUri = `${process.env.MONGODB_CONNECTION_STRING}`
//let dbName: string = "api_db"
let clientPromise: MongoClient
if (!dbUri) throw new Error("Please define the MongoDB Connection String inside .env file")
//if(!dbName) throw new Error('Please define the MongoDB database name inside .env file')

export async function connectDB(mockClient?: boolean): Promise<MongoClient> {
  /*const client: MongoClient = await MongoClient.connect(dbUri)

  clientPromise = (await client.connect()) as MongoClient

  return clientPromise*/
  if (mockClient) {
    dbUri = `${process.env.TEST_MONGODB_CONNECTION_STRING}`
  }

  const client: MongoClient = new MongoClient(dbUri)
  clientPromise = await client.connect()
  return clientPromise
}

export default clientPromise
