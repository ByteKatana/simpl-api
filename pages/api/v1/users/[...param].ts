import { NextApiRequest, NextApiResponse } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"
import { withRateLimit } from "@/lib/api/rate-limits"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey, secretkey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    const user = new apiBuilderController("single-param", "users", param[0], param[1])
    const userData: any[] = await user.fetchData("Equals")
    let responseUsers = userData.filter((user) => user.permission_group !== "root")

    if (process.env.SECRET_KEY !== secretkey) {
      responseUsers = responseUsers.map((user) => {
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
