import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import EntryDataTable from "@/components/studio/entry-data-table"
import Link from "next/link"
import getEntries from "@/lib/actions/studio/entry/get-entries"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { Entry } from "@/interfaces/entry"
import { Toaster } from "sonner"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { CreateEntryDialog } from "@/components/studio/entries/create-entry-dialog"

export const metadata: Metadata = {
  title: "Entries | simpl:api",
  description: "Entries | simpl:api"
}

const EntriesStudioPage = async () => {
  const response = await getEntries()
  const entries: Entry[] = response.data

  const entryTypesResponse = await getEntryTypes()
  const entryTypes = entryTypesResponse.success ? entryTypesResponse.data : []

  return (
    <PermissionGuard reqPermission={["system.entries.list"]} isPage={true}>
      <div className="flex flex-col gap-y-10 ">
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl text-balance font-sans">Entries</h1>
            <p className="text-sm text-muted-foreground">Manage your entries</p>
          </div>
          <div className="flex gap-2">
            <Toaster />
            <CreateEntryDialog entryTypes={entryTypes} />
          </div>
        </div>
        <EntryDataTable data={entries} />
      </div>
    </PermissionGuard>
  )
}
export default EntriesStudioPage
