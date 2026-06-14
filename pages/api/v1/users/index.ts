import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData && apiKeyData[0].key === apikey) {
    //Check permission
    const isAllowed = await hasPermissionApi(apiKeyData[0], "system.users.read")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    //Prepare data
    const user = new apiBuilderController("index", "users")
    const userData: any[] = await user.fetchData()
    const usersWithoutPassword = userData
      .filter((user) => user.permission_group !== "root")
      .map((user) => {
        const { password, ...rest } = user
        return rest
      })
    return res.status(200).json(usersWithoutPassword)
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
