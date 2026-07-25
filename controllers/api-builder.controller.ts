import { prisma } from "@/lib/prisma"
import { FindType } from "@/interfaces"

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
    const modelMap: Record<string, any> = {
      entries: prisma.entry,
      entry_types: prisma.entryType,
      permission_groups: prisma.permissionGroup,
      users: prisma.user,
      api_keys: prisma.apiKey
    }

    const model = modelMap[this.collectionName]

    if (!model) {
      return [{ message: `Error: Collection ${this.collectionName} not found` }]
    }

    try {
      let where: any = {}

      if (this.routeType === "multi-param" && Array.isArray(this.routeData)) {
        const namespace = this.routeData.join(".")
        where = this.buildWhereClause("namespace", namespace, findType)
      } else if (this.routeType === "index") {
        where = {}
      } else if (this.routeType === "single-param") {
        const field = this.findWhere === "_id" ? "id" : (this.findWhere as string)
        where = this.buildWhereClause(field, this.routeData as string, findType)
      } else if (this.routeType === "id") {
        where = { id: this.routeData as string }
      } else {
        return [{ message: "Error: Unexpected route type!" }]
      }

      const dataCollection = await model.findMany({ where })
      return dataCollection
    } catch (e) {
      console.error(e)
      return [{ message: "Database operation failed." }]
    }
  }

  private buildWhereClause(field: string, value: string, findType?: FindType) {
    if (field === "id") {
      return { id: value }
    }

    switch (findType) {
      case "StartsWith":
        return { [field]: { startsWith: value } }
      case "EndsWith":
        return { [field]: { endsWith: value } }
      case "Contains":
        return { [field]: { contains: value } }
      case "Equals":
      default:
        return { [field]: value }
    }
  }
}
