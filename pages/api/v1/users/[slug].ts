import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { getByLimit } from "@/lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
import { ApiKey } from "@/interfaces"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)

  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  const _slug = slug as string

  if (isSystemKey || isValidApiKey(apiKeyData, apikey)) {

    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.users.read")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    //Prepare data
    const user = new apiBuilderController("single-param", "users", "permission_group", slug)
    const fetchData = await user.fetchData("Equals")
    const userData = Array.isArray(fetchData) ? fetchData : []
    const usersWithoutPassword = userData
      .filter((user: any) => user.permission_group !== "root")
      .map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      const userWithLimit = new apiBuilderController("index", "users")
      const fetchDataWithLimit = await userWithLimit.fetchData("Equals")
      const userDataWithLimit = (Array.isArray(fetchDataWithLimit) ? fetchDataWithLimit : []).map((user: any) => {
        const { password, ...rest } = user
        return rest
      })
      return res.status(200).json(getByLimit(_slug, userDataWithLimit))
    }
    return res.status(200).json(usersWithoutPassword)
  }
  res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
