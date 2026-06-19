import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import UserDataTable from "@/components/studio/user-data-table"
import getUsers from "@/lib/actions/studio/users/get-users"
import Link from "next/link"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Users | simpl:api",
  description: "Users | simpl:api"
}

const UsersStudioPage = async () => {
  const response = await getUsers()
  const users = response.success ? response.data : []

  return (
    <PermissionGuard reqPermission={["system.users.list"]} isPage={true}>
      <div className="flex flex-col gap-y-10 ">
        <Toaster />
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl text-balance">Users</h1>
            <p className="text-sm text-muted-foreground">Manage your users</p>
          </div>
          <div className="flex gap-2">
            <PermissionGuard reqPermission={["system.users.create"]}>
              <Link href="/studio/users/new">
                <Button className="flex flex-row gap-2 cursor-pointer items-center bg-green-500 text-white hover:bg-green-600">
                  <CirclePlus />
                  <span>New User</span>
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        </div>
        <UserDataTable data={users} />
      </div>
    </PermissionGuard>
  )
}
export default UsersStudioPage
