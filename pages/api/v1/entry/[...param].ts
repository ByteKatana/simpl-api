import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey } from "@/lib/api/utils"
import { getByIndex } from "@/lib/get-by-index"
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
    if (param.length > 3) {
      //For Sub-entry-types
      apiBuilder = new apiBuilderController("multi-param", "entries", param[0], param.slice(1, param.length - 1))
    } else {
      apiBuilder = new apiBuilderController("single-param", "entries", param[0], param[1])
    }

    if (
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")
    ) {
      const fetchData = await apiBuilder.fetchData("StartsWith")
      return res.status(200).json(getByLimit(param[param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    } else if (Number.isInteger(parseInt(param[param.length - 1]))) {
      const fetchData = await apiBuilder.fetchData("StartsWith")
      return res.status(200).json(getByIndex(param[param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    }

    return res.status(200).json({ message: "Index or Limit parameter must be set." })
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
