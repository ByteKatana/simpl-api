//Core
import { NextApiRequest, NextApiResponse } from "next"

import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
//Controller
import { EntryController } from "@/controllers/entry.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
import { ApiKey } from "@/interfaces"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if ((isSystemKey || isValidApiKey(apiKeyData, apikey)) && process.env.SECRET_KEY === secretkey) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.entries.update")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    if (_req.method === "PUT") {
      const EntryData = new EntryController(_req.body, mockclient === "true")
      const result = await EntryData.update(slug as string)
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do PUT request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
