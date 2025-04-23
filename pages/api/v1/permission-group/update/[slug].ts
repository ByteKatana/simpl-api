//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { PermissionGroupController } from "../../../../../controllers/permission-group.controller"
import { apiKeyController } from "../../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "PUT") {
      const PermissionGroupData = new PermissionGroupController(_req.body)
      const result = await PermissionGroupData.update(slug as string)
      res.status(200).json(result)
    } else {
      res.status(200).json({ message: "You can only do PUT request for this endpoint!" })
    }
  }
  res.status(200).json({ message: "You're not authorized!" })
}
