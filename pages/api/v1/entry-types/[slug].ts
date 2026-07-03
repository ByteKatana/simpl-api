import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"
import { ApiKey } from "@/interfaces"
import checkPermissionApi from "@/lib/check-permission-api"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  const _slug = slug as string
  if (isSystemKey || isValidApiKey(apiKeyData, apikey)) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read", `${_slug}.read`])
    if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

    const apiBuilder = new apiBuilderController("single-param", "entry_types", "namespace", slug)

    //Limit without namesapce
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      const apiBuilderWithLimit = new apiBuilderController("index", "entry_types")
      const fetchData = await apiBuilderWithLimit.fetchData("StartsWith")
      return res.status(200).json(getByLimit(_slug, Array.isArray(fetchData) ? fetchData : []))
    }
    return res.status(200).json(await apiBuilder.fetchData("StartsWith"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
