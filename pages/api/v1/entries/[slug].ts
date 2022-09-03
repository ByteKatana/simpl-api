import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey as string })
  let apiKeyData = await apiKey.findKey()
  let _slug = slug as string
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder: apiBuilderController
    if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
      apiBuilder = new apiBuilderController("index", "entries", "namespace")
      return res.status(200).json(getByLimit(_slug, await apiBuilder.fetchData("Equals")))
    } else {
      apiBuilder = new apiBuilderController("single-param", "entries", "namespace", _slug)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
