import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "@/controllers/api-builder.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { withRateLimit } from "@/lib/api/rate-limits"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
import { ApiKey } from "@/interfaces"

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if (isSystemKey || isValidApiKey(apiKeyData, apikey)) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.permission_groups.read")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

    const apiBuilder = new apiBuilderController("single-param", "permission_groups", "_id", slug)

    res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
