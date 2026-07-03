import { Toaster } from "@/components/ui/sonner"
import { notFound } from "next/navigation"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"
import PermissionGroupForm from "@/app/studio/permission-groups/form"
import { FormMode } from "@/interfaces"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { PermissionGroup } from "@/interfaces/permission_group"

type Props = {
  params: Promise<{ slug: string }>
}

const PermissionGroupEditPage = async ({ params }: Props) => {
  const { slug } = await params

  if (!slug) {
    return (
      <div className="flex flex-col max-w-3xl mx-auto py-10">
        <div className="mb-4">
          <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/studio/permission-groups" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Permission Groups</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold font-sans">Edit Permission Group</h1>
        <small className="text-lg text-neutral-300">
          Missing permission group. Provide permission group id in the URL.
        </small>
      </div>
    )
  }

  const responsePermGroups = await getPermissionGroups()
  const permGroups = responsePermGroups.data

  if (!responsePermGroups.success || !permGroups || permGroups.length === 0) {
    notFound()
  }

  const permGroup = permGroups.find((permGroup: PermissionGroup) => permGroup._id === slug)
  if (!permGroup) {
    notFound()
  }

  const namespaceResponse = await getEntryTypes()
  if (!namespaceResponse.success) {
    notFound()
  }

  const namespaces = namespaceResponse.data

  return (
    <PermissionGuard reqPermission={["system.permission_groups.update"]} isPage={true}>
      <div>
        <div className="flex flex-col max-w-3xl mx-auto">
          <Toaster />
          <div className="mb-4">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
              <Link href="/studio/permission-groups" className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Permission Groups</span>
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-y-0.5 mb-8">
            <h1 className="text-4xl font-bold font-sans">Edit Permission Group: {permGroup.name}</h1>
            <small className="text-lg text-neutral-300">Edit the permission group</small>
          </div>
          <div>
            <PermissionGroupForm
              mode={FormMode.EDIT}
              namespaces={namespaces}
              permGroups={permGroups}
              formPayload={permGroup}
            />
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
export default PermissionGroupEditPage
