import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { withRateLimit } from "@/lib/api/rate-limits"
import { ApiKey } from "@/interfaces"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (param && (isSystemKey || isValidApiKey(apiKeyData, apikey))) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.entries.read")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    let apiBuilder: apiBuilderController
    if (param[0] === "id") {
      apiBuilder = new apiBuilderController("single-param", "entry_types", "_id", param[1])
    } else if (param[0] === "slug") {
      apiBuilder = new apiBuilderController("single-param", "entry_types", "slug", param[1])
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
