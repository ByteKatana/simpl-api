import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import PermissionGroupForm from "@/app/studio/permission-groups/form"
import { FormMode } from "@/interfaces"
import getPermissionGroupById from "@/lib/actions/studio/permission-groups/get-permission-group-by-id"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

type Props = {
  params: Promise<{ slug: string }>
}

const PermissionGroupEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold font-sans">Edit Permission Group</h1>
        <small className="text-lg text-neutral-300">
          Missing permission group. Provide permission group slug in the URL.
        </small>
      </div>
    )
  }

  //const entryResponse = await getEntryBySlug(slug)
  const permGroupResponse = await getPermissionGroupById(slug)

  if (!permGroupResponse.success || !permGroupResponse.data) {
    notFound()
  }

  const permGroup = permGroupResponse.data

  const namespaceResponse = await getEntryTypes()
  if (!namespaceResponse.success || !namespaceResponse.data) {
    notFound()
  }

  const namespaces = namespaceResponse.data

  return (
    <PermissionGuard reqPermission={["system.permission_groups.update"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">Edit Permission Group: {permGroup[0].name}</h1>
            <small className="text-lg text-neutral-300">Edit the permission group</small>
          </div>
          <div>
            <PermissionGroupForm mode={FormMode.EDIT} namespaces={namespaces} formPayload={permGroup[0]} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default PermissionGroupEditPage
