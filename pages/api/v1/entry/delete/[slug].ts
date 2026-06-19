//Core
import { NextApiRequest, NextApiResponse } from "next"
import { withRateLimit } from "@/lib/api/rate-limits"

//Controller
import { EntryController } from "@/controllers/entry.controller"
import { apiKeyController } from "@/controllers/api-key.controller"

//Interface
import { Entry } from "@/interfaces/entry"
//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "DELETE") {
      const dummyObj: Entry = {
        name: "",
        namespace: "",
        slug: ""
      }
      const EntryData = new EntryController(dummyObj, mockclient === "true")
      const result = await EntryData.delete(slug as string)
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do DELETE request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
