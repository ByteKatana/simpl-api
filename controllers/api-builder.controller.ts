import { connectDB } from "../lib/mongodb"
import { ObjectId, MongoClient } from "mongodb"
import { FindType } from "../interfaces"

export class apiBuilderController {
  routeType: string
  collectionName: string
  findWhere?: string
  routeData?: unknown

  constructor(routeType: string, collectionName: string, findWhere?: string, routeData?: unknown) {
    this.routeType = routeType
    this.collectionName = collectionName
    this.findWhere = findWhere ?? undefined
    this.routeData = routeData ?? undefined
  }

  async fetchData(findType?: FindType) {
    let dataCollection: object[]
    let isConnected = false
    let client: MongoClient

    try {
      client = await connectDB()
      isConnected = true
    } catch (e) {
      console.error(e)
    }

    //If there is more than one parameter in uri then convert into "param[0].param[1].param[i]" format to match with namespace field in the DB
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
        let regexp = new RegExp(`^${namespace}`)

        dataCollection = await client
          .db(process.env.DB_NAME)
          .collection(`${this.collectionName}`)
          .find({ namespace: { $regex: regexp } })
          .toArray()
      } else if (findType === "EndsWith") {
        let regexp = new RegExp(`${namespace}$`)
        dataCollection = await client
          .db(process.env.DB_NAME)
          .collection(`${this.collectionName}`)
          .find({ namespace: { $regex: regexp } })
          .toArray()
      } else if (findType === "Contains") {
        let regexp = new RegExp(namespace)
        dataCollection = await client
          .db(process.env.DB_NAME)
          .collection(`${this.collectionName}`)
          .find({ namespace: { $regex: regexp } })
          .toArray()
      }
    } else if (this.routeType === "index") {
      dataCollection = await client.db(process.env.DB_NAME).collection(this.collectionName).find().toArray()
    } else if (this.routeType === "single-param") {
      if (this.findWhere === "_id") {
        dataCollection = await client
          .db(process.env.DB_NAME)
          .collection(`${this.collectionName}`)
          .find({ [this.findWhere]: new ObjectId(this.routeData as string) })
          .toArray()
      } else {
        if (findType === undefined || findType === "Equals") {
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(`${this.collectionName}`)
            .find({ [this.findWhere]: `${this.routeData}` })
            .toArray()
        } else if (findType === "StartsWith") {
          let regexp = new RegExp(`^${this.routeData}`)
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(`${this.collectionName}`)
            .find({ [this.findWhere]: { $regex: regexp } })
            .toArray()
        } else if (findType === "EndsWith") {
          let regexp = new RegExp(`${this.routeData}$`)
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(`${this.collectionName}`)
            .find({ [this.findWhere]: { $regex: regexp } })
            .toArray()
        } else if (findType === "Contains") {
          let regexp = new RegExp(`${this.routeData}`)
          dataCollection = await client
            .db(process.env.DB_NAME)
            .collection(`${this.collectionName}`)
            .find({ [this.findWhere]: { $regex: regexp } })
            .toArray()
        }

        /* dataCollection = await client
          .db("api_db")
          .collection(`${this.collectionName}`)
          .find({ [this.findWhere]: `${this.routeData}` })
          .toArray()*/
      }
    } else if (this.routeType === "id") {
      dataCollection = await client
        .db("api_db")
        .collection(`${this.collectionName}`)
        .find({ _id: `${this.routeData}` })
        .toArray()
    } else {
      dataCollection = [{ message: "Error: Unexpected route type!" }]
    }

    //if(param.length > 1)

    if (isConnected) {
      return dataCollection
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
