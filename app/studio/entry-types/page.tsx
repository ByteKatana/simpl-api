import EntryTypeDataTable from "@/components/studio/entry-type-data-table"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Entry Types | simpl:api",
  description: "Entry Types | simpl:api"
}

const data = [
  {
    _id: "0",
    name: "Fruits",
    namespace: "fruits",
    fields: [
      {
        _id: "0",
        name: "Calories",
        type: "number"
      }
    ],
    entries: 55,
    status: "Published",
    createdBy: "admin"
  },
  {
    _id: "1",
    name: "Pokemon",
    namespace: "pokemon",
    fields: [
      {
        _id: "0",
        name: "element",
        type: "string"
      }
    ],
    entries: 12,
    status: "Published",
    createdBy: "admin"
  },
  {
    _id: "2",
    name: "Mobile Devices",
    namespace: "mobile-devices",
    fields: [
      {
        _id: "0",
        name: "Brand",
        type: "string"
      }
    ],
    entries: 25,
    status: "Draft",
    createdBy: "admin"
  }
]

const EntryTypesStudioPage = () => {
  return (
    <div className="flex flex-col gap-y-10 ">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-4xl text-balance">Entry Types</h1>
          <p className="text-sm text-muted-foreground">Manage your entry types</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
            <CirclePlus />
            <span>New Entry type</span>
          </Button>
        </div>
      </div>
      <EntryTypeDataTable data={data} />
    </div>
  )
}
export default EntryTypesStudioPage
