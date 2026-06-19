//Core
import { NextApiRequest, NextApiResponse } from "next"

//Controller
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { apiKeyController } from "@/controllers/api-key.controller"
import { withRateLimit } from "@/lib/api/rate-limits"

//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey, secretkey, mockclient } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "POST") {
      const PermissionGroupData = new PermissionGroupController(_req.body, mockclient === "true")
      const result = await PermissionGroupData.create()
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do POST request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
