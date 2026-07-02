//Core
import { NextApiRequest, NextApiResponse } from "next"

import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
//Controller
import { UserController } from "@/controllers/user.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
import { ApiKey } from "@/interfaces"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey, secretkey, mockclient } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if ((isSystemKey || isValidApiKey(apiKeyData, apikey)) && process.env.SECRET_KEY === secretkey) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.users.create")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    if (_req.method === "POST") {
      const UserData = new UserController(_req.body, mockclient === "true")
      const result = await UserData.create()
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do POST request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
