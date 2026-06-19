//Core
import { NextApiRequest, NextApiResponse } from "next"

//Controller
import { UserController } from "@/controllers/user.controller"
import { apiKeyController } from "@/controllers/api-key.controller"

//Interface
import { User } from "@/interfaces/user"
import { withRateLimit } from "@/lib/api/rate-limits"
//===============================================

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { slug, apikey, secretkey, mockclient } = _req.query
  const apiKey = new apiKeyController({ key: apikey as string })
  const apiKeyData = await apiKey.findKey()
  if (apiKeyData && apiKeyData[0].key === apikey && process.env.SECRET_KEY === secretkey) {
    if (_req.method === "DELETE") {
      const dummyObj: User = {
        username: "",
        password: "",
        email: "",
        permission_group: ""
      }
      const UserData = new UserController(dummyObj, mockclient === "true")
      const result = await UserData.delete(slug as string)
      return res.status(200).json(result)
    } else {
      return res.status(200).json({ message: "You can only do DELETE request for this endpoint!" })
    }
  }
  return res.status(401).json({ message: "You're not authorized!" })
}

export default withRateLimit(handler)
