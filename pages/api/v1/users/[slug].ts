import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  const _slug = slug as string
  if (isValidApiKey(apiKeyData, apikey)) {
    const user = new apiBuilderController("single-param", "users", "permission_group", slug)
    const fetchData = await user.fetchData("Equals")
    const userData = Array.isArray(fetchData) ? fetchData : []
    const usersWithoutPassword = userData
      .filter((user: any) => user.permission_group !== "root")
      .map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      const userWithLimit = new apiBuilderController("index", "users")
      const fetchDataWithLimit = await userWithLimit.fetchData("Equals")
      const userDataWithLimit = (Array.isArray(fetchDataWithLimit) ? fetchDataWithLimit : []).map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
      return res.status(200).json(getByLimit(_slug, userDataWithLimit))
    }
    return res.status(200).json(usersWithoutPassword)
  }
  res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
