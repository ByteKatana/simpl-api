import { Toaster } from "@/components/ui/sonner"
import getEntryTypeBySlug from "@/lib/actions/studio/entry-types/get-entry-type-by-slug"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import EntryForm from "@/app/studio/entries/form"
import { notFound } from "next/navigation"
import { FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

type Props = {
  searchParams: Promise<{ slug: string }>
}

const Page = async ({ searchParams }: Props) => {
  const { slug } = await searchParams

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold font-sans">New Entry</h1>
        <small className="text-lg text-neutral-300">
          Missing entry type. Provide ?slug=&lt;entry-type-slug&gt; in the URL.
        </small>
      </div>
    )
  }

  const response = await getEntryTypeBySlug(slug)
  if (!response.success || !response.data) {
    notFound()
  }

  const targetEntryType = response.data
  const allTypesResponse = await getEntryTypes()

  let entryTypesHierarchy = [targetEntryType]

  if (allTypesResponse.success && allTypesResponse.data) {
    const allTypes = allTypesResponse.data
    const parents = allTypes.filter(
      (t: any) => targetEntryType.namespace.startsWith(t.namespace) && targetEntryType.namespace !== t.namespace
    )
    // Sort by namespace length to get hierarchy order
    entryTypesHierarchy = [...parents.sort((a, b) => a.namespace.length - b.namespace.length), targetEntryType]
  }
  console.log("TARGETENTRYTYPE: ", targetEntryType.namespace)
  return (
    <PermissionGuard reqPermission={["system.entries.create", `${targetEntryType.namespace}.create`]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">New Entry</h1>
            <small className="text-lg text-neutral-300">
              Create a new entry for &quot;{targetEntryType.name}&quot;
            </small>
          </div>
          <div>
            <EntryForm entryTypes={entryTypesHierarchy} mode={FormMode.CREATE} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}

export default Page
