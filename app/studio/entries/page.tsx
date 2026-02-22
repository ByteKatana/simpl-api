import EntryTypeDataTable from "@/components/studio/entry-type-data-table"
import { Check, CircleDotDashed, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import EntryDataTable from "@/components/studio/entry-data-table"

export const metadata: Metadata = {
  title: "Entries | simpl:api",
  description: "Entries | simpl:api"
}

const data = [
  {
    id: "0",
    name: "Oranges & Apples",
    entry_type: {
      _id: "0",
      name: "Fruits",
      namespace: "fruits"
    },
    slug: "oranges-apples",
    status: "Published"
  },
  {
    id: "1",
    name: "Pineapple",
    entry_type: {
      _id: "0",
      name: "Fruits",
      namespace: "fruits"
    },
    slug: "pineapple",
    status: "Draft"
  },
  {
    id: "2",
    name: "Pears",
    entry_type: {
      _id: "0",
      name: "Fruits",
      namespace: "fruits"
    },
    slug: "pears",
    status: "Draft"
  },
  {
    id: "3",
    name: "Bananas",
    entry_type: {
      _id: "0",
      name: "Fruits",
      namespace: "fruits"
    },
    slug: "bananas",
    status: "Published"
  },
  {
    id: "4",
    name: "Pikachu",
    entry_type: {
      _id: "1",
      name: "Pokemon",
      namespace: "pokemon"
    },
    slug: "pikachu",
    status: "Published"
  },
  {
    id: "5",
    name: "Charmander",
    entry_type: {
      _id: "1",
      name: "Pokemon",
      namespace: "pokemon"
    },
    slug: "charmander",
    status: "Draft"
  },
  {
    id: "6",
    name: "Squirtle",
    entry_type: {
      _id: "1",
      name: "Pokemon",
      namespace: "pokemon"
    },
    slug: "squirtle",
    status: "Draft"
  },
  {
    id: "7",
    name: "Laptop",
    entry_type: {
      _id: "2",
      name: "Mobile Devices",
      namespace: "mobile-devices"
    },
    slug: "laptop",
    status: "Published"
  },
  {
    id: "8",
    name: "Iphone",
    entry_type: {
      _id: "2",
      name: "Mobile Devices",
      namespace: "mobile-devices"
    },
    slug: "iphone",
    status: "Draft"
  },
  {
    id: "9",
    name: "Galaxy S21",
    entry_type: {
      _id: "2",
      name: "Mobile Devices",
      namespace: "mobile-devices"
    },
    slug: "galaxy-s21",
    status: "Draft"
  },
  {
    id: "10",
    name: "Galaxy S22",
    entry_type: {
      _id: "2",
      name: "Mobile Devices",
      namespace: "mobile-devices"
    },
    slug: "galaxy-s22",
    status: "Published"
  },
  {
    id: "11",
    name: "Galaxy S22 Ultra",
    entry_type: {
      _id: "2",
      name: "Mobile Devices",
      namespace: "mobile-devices"
    },
    slug: "galaxy-s22-ultra",
    status: "Draft"
  }
]

const EntriesStudioPage = () => {
  return (
    <div className="flex flex-col gap-y-10 ">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-4xl text-balance">Entries</h1>
          <p className="text-sm text-muted-foreground">Manage your entries</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
            <CirclePlus />
            <span>New Entry</span>
          </Button>
        </div>
      </div>
      <EntryDataTable data={data} />
    </div>
  )
}
export default EntriesStudioPage
