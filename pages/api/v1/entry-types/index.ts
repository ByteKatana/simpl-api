import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { withRateLimit } from "@/lib/api/rate-limits"
import { ApiKey } from "@/interfaces"
import checkPermissionApi from "@/lib/check-permission-api"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (isSystemKey || isValidApiKey(apiKeyData, apikey)) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read"])
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    const apiBuilder = new apiBuilderController("index", "entry_types")
    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
