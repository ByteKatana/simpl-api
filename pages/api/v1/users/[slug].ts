import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { slug, apikey }
	} = _req
	let apiKey = new apiKeyController({ key: apikey as string })
	let apiKeyData = await apiKey.findKey()
	let _slug = slug as string
	if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
		let user = new apiBuilderController("single-param", "users", "permission_group", slug)
		let userData: Array<any> = await user.fetchData("Equals")
		userData.forEach((user) => {
			delete user.password
		})
		if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
			let userWithLimit = new apiBuilderController("index", "users")
			let userDataWithLimit: Array<any> = await userWithLimit.fetchData("Equals")
			userDataWithLimit.forEach((user) => {
				delete user.password
			})
			return res.status(200).json(getByLimit(_slug, userDataWithLimit))
		}
		return res.status(200).json(userData)
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
