import { NextApiResponse, NextApiRequest } from "next"
import { apiBuilderController } from "../../../../controllers/api-builder.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"
import { getByLimit } from "../../../../lib/get-by-limit"

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { slug, apikey }
	} = _req
	let apiKey = new apiKeyController({ key: apikey as string })
	let apiKeyData = await apiKey.findKey()
	let _slug = slug as string
	if (apiKeyData[0] !== undefined && apiKeyData[0].key === apikey) {
		let apiBuilder = new apiBuilderController("single-param", "entry_types", "namespace", slug)

		//Limit without namesapce
		if (_slug.startsWith("first_") || _slug.startsWith("last_") || _slug.startsWith("random_")) {
			let apiBuilderWithLimit = new apiBuilderController("index", "entry_types")
			return res
				.status(200)
				.json(getByLimit(_slug, await apiBuilderWithLimit.fetchData("StartsWith")))
		}
		return res.status(200).json(await apiBuilder.fetchData("StartsWith"))
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
