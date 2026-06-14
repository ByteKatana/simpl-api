import { Toaster } from "@/components/ui/sonner"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { EntryType } from "@/interfaces/entry_type"
import EntryTypeForm from "@/app/studio/entry-types/form"
import { ActionResponse, FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

const Page = async () => {
  const responseEntryTypes: ActionResponse<EntryType[]> = await getEntryTypes()
  const fetchedEntryTypes: EntryType[] | undefined = responseEntryTypes.data
  const namespaces = fetchedEntryTypes?.map((entryType) => entryType.namespace)

  //TODO:
  // 1. Add return button to Entry Types List Page

  return (
    <PermissionGuard reqPermission={["system.entry_types.create"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">New Entry Type</h1>
            <small className="text-lg text-neutral-300">Create a new entry type</small>
          </div>
          <div>
            <EntryTypeForm namespaces={namespaces} mode={FormMode.CREATE} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default Page
