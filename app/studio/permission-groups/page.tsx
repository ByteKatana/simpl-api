import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import PermissionGroupDataTable from "@/components/studio/permission-group-data-table"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

export const metadata: Metadata = {
  title: "Permission Groups | simpl:api",
  description: "Permission Groups | simpl:api"
}

const PermissionGroupsStudioPage = async () => {
  const response = await getPermissionGroups()
  const permGroups = response.success ? response.data : []
  return (
    <PermissionGuard reqPermission={["system.permission_groups.list"]} isPage={true}>
      <div className="flex flex-col gap-y-10 ">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl text-balance font-sans">Permission Groups</h1>
            <p className="text-sm text-muted-foreground">Manage your permission groups</p>
          </div>
          <div className="flex gap-2">
            <Toaster />
            <PermissionGuard reqPermission={["system.permission_groups.create"]}>
              <Link href="/studio/permission-groups/new">
                <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
                  <CirclePlus />
                  <span>New Permission Group</span>
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        </div>
        <PermissionGroupDataTable data={permGroups} />
      </div>
    </PermissionGuard>
  )
}
export default PermissionGroupsStudioPage
