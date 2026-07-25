//Core
import { NextApiRequest, NextApiResponse } from "next"
import { withRateLimit } from "@/lib/api/rate-limits"
import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
import { ApiKey } from "@/interfaces"

//Controller
import { EntryController } from "@/controllers/entry.controller"
import { apiKeyController } from "@/controllers/api-key.controller"

//Interface
import { Entry } from "@/interfaces/entry"
import checkPermissionApi from "@/lib/check-permission-api"
//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if ((isSystemKey || isValidApiKey(apiKeyData, apikey)) && process.env.SECRET_KEY === secretkey) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = checkPermissionApi(keyForPerm, ["system.entries.delete", `${slug}.delete-entry`])
    if (!isAllowed) return res.status(401).json({ message: "You're not authorized!" })

    if (_req.method === "DELETE") {
      const dummyObj = {
        name: "",
        namespace: "",
        slug: "",
        status: "Draft",
        data: {},
        created_at: new Date(),
        updated_at: new Date()
      } as Entry
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
