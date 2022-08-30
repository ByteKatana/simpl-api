//Core
import { NextApiResponse, NextApiRequest } from "next"

//Controller
import { EntryController } from "../../../../controllers/entry.controller"
import { apiKeyController } from "../../../../controllers/api-key.controller"

//===============================================

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const { apikey, secretkey } = _req.query
	let apiKey = new apiKeyController({ key: apikey })
	let apiKeyData = await apiKey.findKey()
	if (
		apiKeyData[0] !== undefined &&
		apiKeyData[0].key === apikey &&
		process.env.SECRET_KEY === secretkey
	) {
		if (_req.method === "POST") {
			let EntryData = new EntryController(_req.body)
			let result = await EntryData.create()
			return res.status(200).json(result)
		} else {
			return res.status(200).json({ message: "You can only do POST request for this endpoint!" })
		}
	}
	return res.status(200).json({ message: "You're not authorized!" })
}
