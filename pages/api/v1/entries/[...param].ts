import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (param && isValidApiKey(apiKeyData, apikey)) {
    let apiBuilder: apiBuilderController
    if (
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")
    ) {
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", param.slice(0, param.length - 1))
      const fetchData = await apiBuilder.fetchData("Equals")
      return res.status(200).json(getByLimit(param[param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", param)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
