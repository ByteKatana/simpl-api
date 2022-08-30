import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug, apikey }
  } = _req
  let apiKey = new apiKeyController({ key: apikey })
  let apiKeyData = await apiKey.findKey()
  if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
    let apiBuilder = new apiBuilderController("single-param", "entries", "slug", slug)

    return res.status(200).json(await apiBuilder.fetchData("Equals"))
  }
  return res.status(200).json({ message: "You're not authorized!" })
}
