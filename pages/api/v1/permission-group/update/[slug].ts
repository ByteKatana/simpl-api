//Core
import { NextApiRequest, NextApiResponse } from "next"

import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
//Controller
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"
import { ApiKey } from "@/interfaces"
import checkPermissionApi from "@/lib/check-permission-api"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if ((isSystemKey || isValidApiKey(apiKeyData, apikey)) && process.env.SECRET_KEY === secretkey) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.permission_group.update"])
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    if (_req.method === "PUT") {
      const PermissionGroupData = new PermissionGroupController(_req.body, mockclient === "true")
      const result = await PermissionGroupData.update(slug as string)
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do PUT request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
