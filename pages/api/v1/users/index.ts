import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { apikey } = _req.query
  let apiKey = new apiKeyController({ key: apikey as string })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let user = new apiBuilderController("index", "users")
    let userData: any[] = await user.fetchData()
    userData.forEach((user) => {
      delete user.password
    })
    res.status(200).json(userData)
  }
  res.status(200).json({ message: "You're not authorized!" })
}
