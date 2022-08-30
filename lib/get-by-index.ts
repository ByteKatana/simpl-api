export function getByIndex(index: number | string, fetchedData: any) {
	if (parseInt(index) <= 0 || index === undefined) return { message: "Invalid Index" }
	else {
		if (index === "first") return fetchedData[0]
		if (index === "last") return fetchedData[fetchedData.length - 1]
		if (index === "random") return fetchedData[Math.floor(Math.random() * fetchedData.length)]
		return fetchedData[parseInt(index - 1)]
	}
}
