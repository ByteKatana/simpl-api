//Core
import { NextApiRequest, NextApiResponse } from "next"

import { isSystemApiKey, isValidApiKey } from "@/lib/api/utils"
//Controller
import { EntryTypeController } from "@/controllers/entry-type.controller"
import { apiKeyController } from "@/controllers/api-key.controller"

//Interface
import { EntryType } from "@/interfaces/entry_type"
import { withRateLimit } from "@/lib/api/rate-limits"
import { PublishStatus, ApiKey } from "@/interfaces"
import { hasPermissionApi } from "@/lib/actions/auth/has-permission-api"
//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const isSystemKey = isSystemApiKey(apikey)
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = isSystemKey ? null : await apiKey.findKey()
  if ((isSystemKey || isValidApiKey(apiKeyData, apikey)) && process.env.SECRET_KEY === secretkey) {
    const keyForPerm: Pick<ApiKey, "key"> = { key: apikey as string }
    const isAllowed = await hasPermissionApi(keyForPerm, "system.entry_types.delete")
    if (!isAllowed) {
      return res.status(401).json({ message: "You're not authorized!" })
    }

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
