//Core
import { NextApiRequest, NextApiResponse } from "next"

import { isValidApiKey } from "@/lib/api/utils"
//Controller
import { EntryTypeController } from "@/controllers/entry-type.controller"
import { apiKeyController } from "@/controllers/api-key.controller"

//Interface
import { EntryType } from "@/interfaces/entry_type"
import { withRateLimit } from "@/lib/api/rate-limits"
import { PublishStatus } from "@/interfaces"
//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (isValidApiKey(apiKeyData, apikey) && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "DELETE") {
      const dummyObj = {
        name: "",
        namespace: "",
        slug: "",
        createdBy: "",
        created_at: new Date(),
        fieldsets: [],
        status: PublishStatus.Draft
      } as EntryType
      const EntryTypeData = new EntryTypeController(dummyObj, mockclient === "true")
      const result = await EntryTypeData.delete(slug as string)
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do DELETE request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}
export default withRateLimit(handler)
