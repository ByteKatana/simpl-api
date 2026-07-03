import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import EntryTypeForm from "@/app/studio/entry-types/form"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

const EntryTypeEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <div className="mb-4">
          <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/studio/entry-types" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Entry Types</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold font-sans">Edit Entry Type</h1>
        <small className="text-lg text-neutral-300">Missing entry type slug. Provide entry type slug in the URL.</small>
      </div>
    )
  }

  const entryTypesResponse = await getEntryTypes()

  if (!entryTypesResponse.success) {
    notFound()
  }

  const namespaces = entryTypesResponse.data.map((entryType) => entryType.namespace)
  const fetchedEntryType = entryTypesResponse.data.find((entryType) => entryType.slug === slug)

  if (!fetchedEntryType) {
    notFound()
  }

  return (
    <PermissionGuard reqPermission={["system.entry_type.update", `${fetchedEntryType.namespace}.update`]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="mb-4">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
              <Link href="/studio/entry-types" className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Entry Types</span>
              </Link>
            </Button>
          </div>
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
