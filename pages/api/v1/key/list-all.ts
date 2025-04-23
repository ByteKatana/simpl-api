//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey, secretkey } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    const apiBuilder = new apiBuilderController("index", "api_keys")
    res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  res.status(200).json({ message: "You're not authorized!" })
}
