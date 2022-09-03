//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { PermissionGroupController } from "../../../../../controllers/permission-group.controller"
import { apiKeyController } from "../../../../../controllers/api-key.controller"

//Interface
import { PermissionGroup } from "../../../../../interfaces/"
//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const { slug, apikey, secretkey } = _req.query
	let apiKey = new apiKeyController({ key: apikey as string })
	let apiKeyData = await apiKey.findKey()
	if (
		apiKeyData[0] !== undefined &&
		apiKeyData[0].key === apikey &&
		process.env.SECRET_KEY === secretkey
	) {
		if (_req.method === "DELETE") {
			let dummyObj: PermissionGroup = {
				name: "",
				slug: "",
				privileges: [{}]
			}
			let PermissionGroupData = new PermissionGroupController(dummyObj)
			let result = await PermissionGroupData.delete(slug as string)
			return res.status(200).json(result)
		} else {
			return res.status(200).json({ message: "You can only do DELETE request for this endpoint!" })
		}
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
