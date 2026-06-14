import EntryTypeDataTable from "@/components/studio/entry-type-data-table"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { EntryType } from "@/interfaces/entry_type"
import { Toaster } from "sonner"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { ActionResponse } from "@/interfaces"

export const metadata: Metadata = {
  title: "Entry Types | simpl:api",
  description: "Entry Types | simpl:api"
}

const EntryTypesStudioPage = async () => {
  const response: ActionResponse<EntryType[]> = await getEntryTypes()
  const entryTypes: EntryType[] | undefined = response.data
  return (
    <PermissionGuard reqPermission={["system.entry_types.list"]} isPage={true}>
      <div className="flex flex-col gap-y-10 ">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl text-balance font-sans">Entry Types</h1>
            <p className="text-sm text-muted-foreground">Manage your entry types</p>
          </div>
          <div className="flex gap-2">
            <Toaster />
            <PermissionGuard reqPermission={["system.entry_types.create"]}>
              <Link href="/studio/entry-types/new">
                <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
                  <CirclePlus />
                  <span>New Entry type</span>
                </Button>
              </Link>
            </PermissionGuard>
          </div>
        </div>
        <EntryTypeDataTable data={entryTypes} />
      </div>
    </PermissionGuard>
  )
}
export default EntryTypesStudioPage
