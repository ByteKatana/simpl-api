import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { param, apikey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey as string })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder: apiBuilderController
    if (
      param[param.length - 1].startsWith("first_") ||
      param[param.length - 1].startsWith("last_") ||
      param[param.length - 1].startsWith("random_")
    ) {
      //first_!
      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param.slice(0, param.length - 1))
      return res.status(200).json(getByLimit(param[param.length - 1], await apiBuilder.fetchData("StartsWith")))
    } else {
      apiBuilder = new apiBuilderController("multi-param", "entry_types", "namespace", param.slice(0, param.length))
    }
    return res.status(200).json(await apiBuilder.fetchData("StartsWith"))
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
