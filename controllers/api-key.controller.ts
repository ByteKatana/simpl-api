import { prisma } from "@/lib/prisma"

//Interface
import { ApiKey } from "@/interfaces"

//===============================================

export class apiKeyController {
  apiKey: Partial<ApiKey>

  constructor(apiKey: Partial<ApiKey>) {
    this.apiKey = apiKey
  }

  async findKey(): Promise<ApiKey[] | { message: string }[] | undefined> {
    try {
      const findResult = await prisma.apiKey.findMany({
        where: { key: this.apiKey.key }
      })
      return findResult as unknown as ApiKey[]
    } catch (e) {
      console.error(e)
      return [{ message: "Database operation failed" }]
    }
  }

  async create() {
    try {
      const insertResult = await prisma.apiKey.create({
        data: {
          key: this.apiKey.key as string,
          description: this.apiKey.description || "",
          permission_group: this.apiKey.permission_group || "",
          rate_limits: this.apiKey.rate_limits as any,
          created_at: this.apiKey.created_at || new Date().toISOString()
        }
      })

      if (insertResult && insertResult.id) {
        return { status: "success", message: "API Key has been generated.", keyId: insertResult.id }
      } else {
        return { status: "failed", message: "Failed to create the api key." }
      }
    } catch (e) {
      console.error(e)
      return { status: "failed", message: "Failed to create the api key." }
    }
  }

  async delete(id: string) {
    try {
      const deleteResult = await prisma.apiKey.deleteMany({
        where: { id: id }
      })

      if (deleteResult && deleteResult.count === 1) {
        return { status: "success", message: "API Key has been removed." }
      } else {
        return { status: "failed", message: "Failed to delete the api key." }
      }
    } catch (e) {
      console.error("An error occurred while deleting the API key:", e)
      return { status: "failed", message: "An error occurred while deleting the API key." }
    }
  }
}
