//Core
import { NextApiRequest, NextApiResponse } from "next"

//Utility
import { uid } from "uid"

//Controller
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { secretkey } = _req.query
  if (process.env.SECRET_KEY === secretkey) {
    const generatedKey = uid(32)
    const keyObj = { key: generatedKey }
    const apiKeyData = new apiKeyController(keyObj)
    const result = await apiKeyData.create()
    return res.status(200).json({ key: generatedKey, result: result })
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
