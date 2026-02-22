import EntryTypeDataTable from "@/components/studio/entry-type-data-table"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import PermissionGroupDataTable from "@/components/studio/permission-group-data-table"
import UserDataTable from "@/components/studio/user-data-table"

export const metadata: Metadata = {
  title: "Entry Types | simpl:api",
  description: "Entry Types | simpl:api"
}

const data = [
  {
    _id: "0",
    username: "mr_admin",
    email: "admin@localhost.dev",
    permission_group: "admin"
  },
  {
    _id: "1",
    username: "sir_william",
    email: "william@localhost.dev",
    permission_group: "editor"
  },
  {
    _id: "2",
    username: "officer_john",
    email: "john@localhost.dev",
    permission_group: "viewer"
  }
]

const UsersStudioPage = () => {
  return (
    <div className="flex flex-col gap-y-10 ">
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-4xl text-balance">Users</h1>
          <p className="text-sm text-muted-foreground">Manage your users</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
            <CirclePlus />
            <span>New User</span>
          </Button>
        </div>
      </div>
      <UserDataTable data={data} />
    </div>
  )
}
export default UsersStudioPage
