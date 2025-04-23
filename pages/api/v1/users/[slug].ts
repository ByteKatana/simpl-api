import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  const _slug = slug as string
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    const user = new apiBuilderController("single-param", "users", "permission_group", slug)
    const userData: any[] = await user.fetchData("Equals")
    userData.forEach((user) => {
      delete user.password
    })
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      const userWithLimit = new apiBuilderController("index", "users")
      const userDataWithLimit: any[] = await userWithLimit.fetchData("Equals")
      userDataWithLimit.forEach((user) => {
        delete user.password
      })
      res.status(200).json(getByLimit(_slug, userDataWithLimit))
    }
    res.status(200).json(userData)
  }
  res.status(200).json({ message: "You're not authorized!" })
}
