import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey, secretkey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey as string })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let user = new apiBuilderController("single-param", "users", param[0], param[1])
    let userData: any[] = await user.fetchData("Equals")
    if (process.env.SECRET_KEY !== secretkey) {
      userData.forEach((user) => {
        delete user.password
      })
    }
    if (param.length > 2) {
      if (
        param[param.length - 1].startsWith("first_") ||
        param[param.length - 1].startsWith("last_") ||
        param[param.length - 1].startsWith("random_")
      ) {
        res.status(200).json(getByLimit(param[param.length - 1], userData))
      } else {
        res.status(200).json({ message: "Invalid limit value" })
      }
    }
    res.status(200).json(userData)
  }
  res.status(200).json({ message: "You're not authorized!" })
}
