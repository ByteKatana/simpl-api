export function getByLimit(limit: string, fetchedData: any) {
	let limitData = limit.split("_")
	if (
		Number.isNaN(parseInt(limitData[1])) ||
		limitData.length !== 2 ||
		parseInt(limitData[1] <= 0) ||
		limitData[1] === ""
	) {
		return { message: "Invalid limit value" }
	} else {
		if (limitData[0] === "first") return fetchedData.slice(0, parseInt(limitData[1]))
		if (limitData[0] === "last") return fetchedData.slice(-parseInt(limitData[1]))
		if (limitData[0] === "random") {
			let selectedData: Array = []
			for (let i = 0; i < limitData[1]; i++) {
				selectedData.push(fetchedData[Math.floor(Math.random() * fetchedData.length)])
			}
			return selectedData
		}
	}
}
