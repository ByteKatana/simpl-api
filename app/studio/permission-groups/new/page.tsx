import { Toaster } from "@/components/ui/sonner"
import { FormMode } from "@/interfaces"
import PermissionGroupForm from "@/app/studio/permission-groups/form"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

const Page = async () => {
  const responseNamespaces = await getEntryTypes()
  const namespaces = responseNamespaces.data
  //TODO:
  // 1. Add return button to Permission Group List Page

  return (
    <PermissionGuard reqPermission={["system.permission_groups.create"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">New Permission Group</h1>
            <small className="text-lg text-neutral-300">Create a new permission group</small>
          </div>
          <div>
            <PermissionGroupForm namespaces={namespaces} mode={FormMode.CREATE} />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default Page
