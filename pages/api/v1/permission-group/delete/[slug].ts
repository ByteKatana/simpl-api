//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { PermissionGroupController } from "../../../../../controllers/permission-group.controller"
import { apiKeyController } from "../../../../../controllers/api-key.controller"

//Interface
import { PermissionGroup } from "../../../../../interfaces/"
//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "DELETE") {
      const dummyObj: PermissionGroup = {
        name: "",
        slug: "",
        privileges: [{}]
      }
      const PermissionGroupData = new PermissionGroupController(dummyObj)
      const result = await PermissionGroupData.delete(slug as string)
      res.status(200).json(result)
    } else {
      res.status(200).json({ message: "You can only do DELETE request for this endpoint!" })
    }
  }
  res.status(200).json({ message: "You're not authorized!" })
}
