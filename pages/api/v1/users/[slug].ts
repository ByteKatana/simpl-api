import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { slug, apikey }
	} = _req
	let apiKey = new apiKeyController({ key: apikey })
	let apiKeyData = await apiKey.findKey()
	if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
		let user = new apiBuilderController("single-param", "users", "permission_group", slug)
		let userData = await user.fetchData("Equals")
		userData.forEach((user) => {
			delete user.password
		})
		if (slug.startsWith("first_") || slug.startsWith("last_") || slug.startsWith("random_")) {
			let userWithLimit = new apiBuilderController("index", "users")
			let userDataWithLimit = await userWithLimit.fetchData("Equals")
			userDataWithLimit.forEach((user) => {
				delete user.password
			})
			return res.status(200).json(getByLimit(slug, userDataWithLimit))
		}
		return res.status(200).json(userData)
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
