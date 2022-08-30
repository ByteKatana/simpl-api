import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder: apiBuilderController
    if (param[0] === "id") {
      apiBuilder = new apiBuilderController("single-param", "entry_types", "_id", param[1])
    } else if (param[0] === "slug") {
      apiBuilder = new apiBuilderController("single-param", "entry_types", "slug", param[1])
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
