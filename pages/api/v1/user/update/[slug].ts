//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { UserController } from "../../../../../controllers/user.controller"
import { apiKeyController } from "../../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey } = _req.query
  let apiKey = new apiKeyController({ key: apikey as string })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "PUT") {
      let UserData = new UserController(_req.body)
      let result = await UserData.update(slug as string)
      res.status(200).json(result)
    } else {
      res.status(200).json({ message: "You can only do PUT request for this endpoint!" })
    }
  }
  res.status(200).json({ message: "You're not authorized!" })
}
