import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData && apiKeyData[0].key === apikey) {
    const apiBuilder = new apiBuilderController("index", "permission_groups")
    const permGroupsData: any[] = await apiBuilder.fetchData("Equals")
    return res.status(200).json(permGroupsData.filter((group) => group.slug !== "root"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
