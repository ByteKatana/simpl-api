import { connectDB } from "../lib/mongodb"
import { MongoClient, ObjectId } from "mongodb"
import { FindType } from "../interfaces"

export class apiBuilderController {
  routeType: string
  collectionName: string
  findWhere?: string
  routeData?: string | string[] | object[]

  constructor(routeType: string, collectionName: string, findWhere?: string, routeData?: string | string[] | object[]) {
    this.routeType = routeType
    this.collectionName = collectionName
    this.findWhere = findWhere ?? undefined
    this.routeData = routeData ?? undefined
  }

  async fetchData(findType?: FindType) {
    let dataCollection: object[]
    let isConnected = false
    let client: MongoClient | undefined

    try {
      client = await connectDB()
      isConnected = true

      // If there is more than one parameter in uri then convert into "param[0].param[1].param[i]" format to match with namespace field in the DB
      if (this.routeType === "multi-param" && Array.isArray(this.routeData)) {
        let namespace = ""

        for (let i = 0; i < this.routeData.length; i++) {
          if (i === 0) namespace += `${this.routeData[i]}`
          else namespace += `.${this.routeData[i]}`
        }

        if (findType === undefined || findType === "Equals") {
          dataCollection = await client
            .db(`${process.env.DB_NAME}`)
            .collection(this.collectionName)
            .find({ namespace: namespace })
            .toArray()
        } else if (findType === "StartsWith") {
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(this.collectionName)
            .find({ namespace: { $regex: `^${String(namespace)}` } })
            .toArray()
        } else if (findType === "EndsWith") {
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(this.collectionName)
            .find({ namespace: { $regex: `${String(namespace)}$` } })
            .toArray()
        } else if (findType === "Contains") {
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(this.collectionName)
            .find({ namespace: { $regex: `${String(namespace)}$` } })
            .toArray()
        }
      } else if (this.routeType === "index") {
        dataCollection = await client.db(process.env.DB_NAME).collection(this.collectionName).find().toArray()
      } else if (this.routeType === "single-param") {
        if (this.findWhere === "_id") {
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(this.collectionName)
            .find({ [this.findWhere]: new ObjectId(this.routeData as string) })
            .toArray()
        } else {
          if (findType === undefined || findType === "Equals") {
            dataCollection = await client
              .db(process.env.DB_NAME)
              .collection(this.collectionName)
              .find({ [this.findWhere]: `${this.routeData}` })
              .toArray()
          } else if (findType === "StartsWith") {
            dataCollection = await client
              .db(process.env.DB_NAME)
              .collection(this.collectionName)
              .find({ [this.findWhere]: { $regex: `^${String(this.routeData)}` } })
              .toArray()
          } else if (findType === "EndsWith") {
            dataCollection = await client
              .db(process.env.DB_NAME)
              .collection(this.collectionName)
              .find({ [this.findWhere]: { $regex: `${String(this.routeData)}$` } })
              .toArray()
          } else if (findType === "Contains") {
            dataCollection = await client
              .db(process.env.DB_NAME)
              .collection(this.collectionName)
              .find({ [this.findWhere]: { $regex: `${String(this.routeData)}$` } })
              .toArray()
          }
        }
      } else if (this.routeType === "id") {
        dataCollection = await client
          .db("api_db")
          .collection(this.collectionName)
          .find({ _id: `${this.routeData}` })
          .toArray()
      } else {
        dataCollection = [{ message: "Error: Unexpected route type!" }]
      }

      // if(param.length > 1)
      if (isConnected) {
        return dataCollection
      } else {
        return [{ message: "Database connection is NOT established" }]
      }
    } catch (e) {
      console.error(e)
      return [{ message: "Database operation failed." }]
    } finally {
      if (client?.close && typeof client.close === "function") {
        await client.close()
      }
    }
  }
}
