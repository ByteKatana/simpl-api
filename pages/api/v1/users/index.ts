import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiRequest) {
	const { apikey } = _req.query
	let apiKey = new apiKeyController({ key: apikey })
	let apiKeyData = await apiKey.findKey()
	if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
		let user = new apiBuilderController("index", "users")
		let userData = await user.fetchData()
		userData.forEach((user) => {
			delete user.password
		})
		return res.status(200).json(userData)
	}
	return res.status(200).json({ message: "You're not authorized!" })
}