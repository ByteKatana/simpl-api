import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  const _slug = slug as string
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    const apiBuilder = new apiBuilderController("single-param", "entry_types", "namespace", slug)

    //Limit without namesapce
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      const apiBuilderWithLimit = new apiBuilderController("index", "entry_types")
      return res.status(200).json(getByLimit(_slug, await apiBuilderWithLimit.fetchData("StartsWith")))
    }
    return res.status(200).json(await apiBuilder.fetchData("StartsWith"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
