import { FindType } from "@/interfaces"
import { WhereClause } from "@/types"

export function buildWhereClause(field: string, value: string, findType?: FindType): WhereClause {
  if (field === "id") {
    return { id: value }
  }

  switch (findType) {
    case "StartsWith":
      return { [field]: { startsWith: value } }
    case "EndsWith":
      return { [field]: { EndsWith: value } }
    case "Contains":
      return { [field]: { contains: value } }
    case "Equals":
    default:
      return { [field]: value }
  }
}
