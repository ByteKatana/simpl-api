import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"
import { isValidApiKey } from "@/lib/api/utils"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (isValidApiKey(apiKeyData, apikey)) {
    const apiBuilder = new apiBuilderController("single-param", "entries", "slug", slug as string)

    res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
