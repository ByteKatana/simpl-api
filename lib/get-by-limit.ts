export function getByLimit(limit: string, fetchedData: object[]) {
  let limitData = limit.split("_")
  if (
    Number.isNaN(Number(limitData[1])) ||
    limitData.length !== 2 ||
    Number(limitData[1]) <= 0 ||
    limitData[1] === ""
  ) {
    return { message: "Invalid limit value" }
  } else {
    if (limitData[0] === "first") return fetchedData.slice(0, Number(limitData[1]))
    if (limitData[0] === "last") return fetchedData.slice(-Number(limitData[1]))
    if (limitData[0] === "random") {
      let selectedData: Array<any> = []
      for (let i = 0; i < Number(limitData[1]); i++) {
        selectedData.push(fetchedData[Math.floor(Math.random() * fetchedData.length)])
      }
      return selectedData
    }
  }
}
