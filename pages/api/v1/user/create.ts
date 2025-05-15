//Core
import { NextApiRequest, NextApiResponse } from "next"

//Controller
import { UserController } from "../../../../controllers/user.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey, secretkey, mockclient } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "POST") {
      const UserData = new UserController(_req.body, mockclient === "true")
      const result = await UserData.create()
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do POST request for this endpoint!" })
    }
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
