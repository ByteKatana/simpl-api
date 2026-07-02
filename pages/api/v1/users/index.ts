import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (isSystemKey || isValidApiKey(apiKeyData, apikey)) {
    //Check permission
    const keyForPerm: any = isSystemKey ? { key: apikey as string } : apiKeyData![0]
    const isAllowed = await hasPermissionApi(keyForPerm, "system.users.read")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    //Prepare data
    const user = new apiBuilderController("index", "users")
    const fetchData = await user.fetchData()
    const userData = Array.isArray(fetchData) ? fetchData : []
    const usersWithoutPassword = userData
      .filter((user: any) => user.permission_group !== "root")
      .map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
    return res.status(200).json(usersWithoutPassword)
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
