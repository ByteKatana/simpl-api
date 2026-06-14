import { Toaster } from "@/components/ui/sonner"
import getEntryBySlug from "@/lib/actions/studio/entry/get-entry-by-slug"
import EntryForm from "@/app/studio/entries/form"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { notFound } from "next/navigation"
import { FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

type Props = {
  params: Promise<{ slug: string }>
}

const EntryEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold font-sans">Edit Entry</h1>
        <small className="text-lg text-neutral-300">Missing entry name.</small>
      </div>
    )
  }

  const entryResponse = await getEntryBySlug(slug)
  if (!entryResponse.success || !entryResponse.data || !entryResponse.data[0]) {
    notFound()
  }

  const entry = entryResponse.data[0]
  const allTypesResponse = await getEntryTypes()

  if (!allTypesResponse.success || !allTypesResponse.data) {
    notFound()
  }

  const allTypes = allTypesResponse.data
  const hierarchy = allTypes
    .filter((t: any) => entry.namespace.startsWith(t.namespace))
    .sort((a: any, b: any) => a.namespace.length - b.namespace.length)

  if (hierarchy.length === 0) {
    notFound()
  }

  return (
    <PermissionGuard reqPermission={["system.entries.update", `${entry.namespace}.update-entry`]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">Edit Entry: {entry.name}</h1>
            <small className="text-lg text-neutral-300">Edit the entry</small>
          </div>
          <div>
            <EntryForm entryTypes={hierarchy} mode={FormMode.EDIT} formPayload={entry} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}

export default EntryEditPage
