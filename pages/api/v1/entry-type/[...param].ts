import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
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
    //Check permission
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const paramNS = _param[0] === "id" || _param[0] === "slug" ? _param[1] : _param.join(".")
    let isAllowed = false

    let apiBuilder: apiBuilderController
    if (_param[0] === "id") {
      isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read"])
      if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

      apiBuilder = new apiBuilderController("single-param", "entry_types", "_id", _param[1])
    } else if (_param[0] === "slug") {
      isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read"])
      if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

      apiBuilder = new apiBuilderController("single-param", "entry_types", "slug", _param[1])
    } else {
      isAllowed = await checkPermissionApi(keyForPerm, ["system.entry_types.read", `${paramNS}.read`])
      if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", _param)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
