import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"
import { ApiKey } from "@/interfaces"
import checkPermissionApi from "@/lib/check-permission-api"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey, secretkey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (param && (isSystemKey || isValidApiKey(apiKeyData, apikey))) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await checkPermissionApi(keyForPerm, ["system.users.read"])
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    const user = new apiBuilderController("single-param", "users", param[0], param[1])
    const fetchData = await user.fetchData("Equals")
    const userData = Array.isArray(fetchData) ? fetchData : []
    let responseUsers = userData.filter((user: any) => user.permission_group !== "root")

    if (process.env.SECRET_KEY !== secretkey) {
      responseUsers = responseUsers.map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
    }
    if (param.length > 2) {
      if (
        param[param.length - 1].startsWith("first_") ||
        param[param.length - 1].startsWith("last_") ||
        param[param.length - 1].startsWith("random_")
      ) {
        return res.status(200).json(getByLimit(param[param.length - 1], responseUsers))
      } else {
        return res.status(200).json({ message: "Invalid limit value" })
      }
    }
    return res.status(200).json(responseUsers)
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
