import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey } from "@/lib/api/utils"
import { withRateLimit } from "@/lib/api/rate-limits"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (isValidApiKey(apiKeyData, apikey)) {
    const apiBuilder = new apiBuilderController("index", "permission_groups")
    const fetchData = await apiBuilder.fetchData("Equals")
    const permGroupsData = Array.isArray(fetchData) ? fetchData : []
    return res.status(200).json(permGroupsData.filter((group: any) => group.slug !== "root"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
