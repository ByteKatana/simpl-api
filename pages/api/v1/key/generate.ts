//Core
import { NextApiResponse, NextApiRequest } from "next"

//Utility
import { uid } from "uid"

//Controller
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { secretkey } = _req.query
  if (process.env.SECRET_KEY === secretkey) {
    let generatedKey = uid(32)
    let keyObj = { key: generatedKey }
    let apiKeyData = new apiKeyController(keyObj)
    let result = await apiKeyData.create()
    res.status(200).json({ key: generatedKey, result: result })
  }
  res.status(200).json({ message: "You're not authorized!" })
}
