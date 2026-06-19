import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  const _slug = slug as string
  if (isValidApiKey(apiKeyData, apikey)) {
    let apiBuilder: apiBuilderController
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      apiBuilder = new apiBuilderController("index", "entries", "namespace")
      const fetchData = await apiBuilder.fetchData("Equals")
      return res.status(200).json(getByLimit(_slug, Array.isArray(fetchData) ? fetchData : []))
    } else {
      apiBuilder = new apiBuilderController("single-param", "entries", "namespace", _slug)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
