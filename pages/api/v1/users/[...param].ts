import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { param, apikey }
	} = _req
	let apiKey = new apiKeyController({ key: apikey })
	let apiKeyData = await apiKey.findKey()
	if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
		let user = new apiBuilderController("single-param", "users", param[0], param[1])
		let userData = await user.fetchData("Equals")
		userData.forEach((user) => {
			delete user.password
		})
		if (param.length > 2) {
			if (
				param[param.length - 1].startsWith("first_") ||
				param[param.length - 1].startsWith("last_") ||
				param[param.length - 1].startsWith("random_")
			) {
				return res.status(200).json(getByLimit(param[param.length - 1], userData))
			} else {
				return res.status(200).json({ message: "Invalid limit value" })
			}
		}
		return res.status(200).json(userData)
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
