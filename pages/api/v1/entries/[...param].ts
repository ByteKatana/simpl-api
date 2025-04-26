import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey }
  } = _req
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder: apiBuilderController
    if (
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")
    ) {
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", param.slice(0, param.length - 1))
      res.status(200).json(getByLimit(param[param.length - 1], await apiBuilder.fetchData("Equals")))
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entries", "namespace", param)
    }

    res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  res.status(200).json({ message: "You're not authorized!" })
}
