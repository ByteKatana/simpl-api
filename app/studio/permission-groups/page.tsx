import EntryTypeDataTable from "@/components/studio/entry-type-data-table"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import PermissionGroupDataTable from "@/components/studio/permission-group-data-table"

export const metadata: Metadata = {
  title: "Entry Types | simpl:api",
  description: "Entry Types | simpl:api"
}

const data = [
  {
    _id: "0",
    name: "Admin",
    users: 2,
    privileges: [
      {
        fruits: {
          permissions: ["read", "update", "delete", "create"]
        }
      },
      {
        pokemon: {
          permissions: ["read", "update", "delete", "create"]
        }
      },
      {
        mobile_devices: {
          permissions: ["read", "update", "delete", "create"]
        }
      }
    ]
  },
  {
    _id: "1",
    name: "Editor",
    users: 5,
    privileges: [
      {
        fruits: {
          permissions: ["read", "update"]
        },
        mobile_devices: {
          permissions: ["read", "update"]
        },
        pokemon: {
          permissions: ["read", "update"]
        }
      },
      {
        pokemon: {}
      }
    ]
  },
  {
    _id: "2",
    name: "Viewer",
    users: 10,
    privileges: [
      {
        fruits: {
          permissions: ["read"]
        },
        mobile_devices: {
          permissions: ["read"]
        },
        pokemon: {
          permissions: ["read"]
        }
      }
    ]
  }
]

const PermissionGroupsStudioPage = () => {
  return (
    <div className="flex flex-col gap-y-10 ">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-4xl text-balance">Permission Groups</h1>
          <p className="text-sm text-muted-foreground">Manage your permission groups</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
            <CirclePlus />
            <span>New Permission Group</span>
          </Button>
        </div>
      </div>
      <PermissionGroupDataTable data={data} />
    </div>
  )
}
export default PermissionGroupsStudioPage
