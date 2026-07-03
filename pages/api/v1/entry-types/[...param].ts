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
  const _param = param as string[]
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (param && (isSystemKey || isValidApiKey(apiKeyData, apikey))) {
    const isparamLimiterSet =
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")

    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const paramNs = isparamLimiterSet
      ? _param.slice(0, param.length - 1).join(".")
      : _param.slice(0, param.length).join(".")
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read", `${paramNs}.read`])
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    let apiBuilder: apiBuilderController
    if (isparamLimiterSet) {
      //first_!

      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param.slice(0, param.length - 1))
      const fetchData = await apiBuilder.fetchData("StartsWith")
      return res.status(200).json(getByLimit(param[param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param.slice(0, param.length))
    }
    return res.status(200).json(await apiBuilder.fetchData("StartsWith"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
