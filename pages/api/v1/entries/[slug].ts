import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder: apiBuilderController
    if (slug.startsWith("first_") || slug.startsWith("last_") || slug.startsWith("random_")) {
      apiBuilder = new apiBuilderController("index", "entries", "namespace")
      return res.status(200).json(getByLimit(slug, await apiBuilder.fetchData("Equals")))
    } else {
      apiBuilder = new apiBuilderController("single-param", "entries", "namespace", slug)
    }

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
