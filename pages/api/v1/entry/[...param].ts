import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isValidApiKey, isSystemApiKey } from "@/lib/api/utils"
import { getByIndex } from "@/lib/get-by-index"
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
      _param[_param.length - 1].startsWith("first_") ||
      _param[_param.length - 1].startsWith("last_") ||
      _param[_param.length - 1].startsWith("random_")

    //Check Permission
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const paramNs: string = _param.length >= 3 ? _param.slice(0, _param.length - 1).join(".") : _param.join(".")
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.entries.read", `${paramNs}.read-entry`])
    if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

    let apiBuilder: apiBuilderController
    if (_param.length > 3) {
      //For Sub-entry-types
      apiBuilder = new apiBuilderController("multi-param", "entries", _param[0], _param.slice(1, _param.length - 1))
    } else {
      apiBuilder = new apiBuilderController("single-param", "entries", _param[0], _param[1])
    }

    if (isparamLimiterSet) {
      const fetchData = await apiBuilder.fetchData("StartsWith")
      return res.status(200).json(getByLimit(_param[_param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    } else if (Number.isInteger(parseInt(_param[_param.length - 1]))) {
      const fetchData = await apiBuilder.fetchData("StartsWith")
      return res.status(200).json(getByIndex(_param[_param.length - 1], Array.isArray(fetchData) ? fetchData : []))
    }

    return res.status(200).json({ message: "Index or Limit parameter must be set." })
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
