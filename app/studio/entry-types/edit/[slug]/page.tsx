import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import EntryTypeForm from "@/app/studio/entry-types/form"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { EntryType } from "@/interfaces/entry_type"
import { ActionResponse, FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

type Props = {
  params: Promise<{ slug: string }>
}

const EntryTypeEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold font-sans">Edit Entry Type</h1>
        <small className="text-lg text-neutral-300">Missing entry type slug. Provide entry type slug in the URL.</small>
      </div>
    )
  }

  const entryTypesResponse: ActionResponse = await getEntryTypes()
  const namespaces: Array<Pick<EntryType, "namespace">> = entryTypesResponse.data.map(
    (entryType: EntryType) => entryType.namespace
  )

  if (!entryTypesResponse.success || !entryTypesResponse.data) {
    notFound()
  }

  const fetchedEntryType = entryTypesResponse.data.find((entryType) => entryType.slug === slug)

  return (
    <PermissionGuard reqPermission={["system.entry_type.update", `${fetchedEntryType.namespace}.update`]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">Edit Entry Type: {fetchedEntryType.name}</h1>
            <small className="text-lg text-neutral-300">Edit the entry type</small>
          </div>
          <div>
            <EntryTypeForm namespaces={namespaces} mode={FormMode.EDIT} formPayload={fetchedEntryType} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default EntryTypeEditPage
