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
    query: { param, apikey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (param && (isSystemKey || isValidApiKey(apiKeyData, apikey))) {
    const isParamLimiterSet =
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")

    let apiBuilder: apiBuilderController
    if (isParamLimiterSet) {
      const paramNs = param.slice(0, param.length - 1)
      //Check permission
      const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
      const isAllowed = await checkPermissionApi(keyForPerm, ["system.entries.read", `${paramNs}.read-entry`])
      if (!isAllowed) {
        return res.status(401).json({ message: "You're not authorized!" })
      }

      //Prepare data
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", paramNs)
      const fetchData = await apiBuilder.fetchData("Equals")
      return res.status(200).json(getByLimit(param[param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    } else {
      //Check permission
      const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
      const isAllowed = await checkPermissionApi(keyForPerm, ["system.entries.read", `${param}.read-entry`])
      if (!isAllowed) {
        return res.status(401).json({ message: "You're not authorized!" })
      }

      //Prepare data
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", param)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
