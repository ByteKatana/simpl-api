"use client"
import PrivilegesSettings from "@/components/studio/permission-groups/privileges-settings"
import { useForm } from "@tanstack/react-form"
import { FormMode } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { EntryType } from "@/interfaces/entry_type"
import { permGroupDbToForm } from "@/lib/db-to-form"
import { toast } from "sonner"
import updateAppearanceSettings from "@/lib/actions/studio/settings/update-appearance-settings"
import updatePermissionGroups from "@/lib/actions/studio/permission-groups/update-permission-groups"

type Props = {
  permGroups: PermissionGroup[]
  namespaces: EntryType[]
}

const PermissionGroupSettingsForm = ({ permGroups, namespaces }: Props) => {
  //TODO:
  // 1.To enable entry permission, read privilege of entries must be enabled
  // 2. To enable Create, Update, Delete privilege of a system feature, read privilege of a system feature must be enabled
  // 3. To enable Create, Update, Delete privilege of entries, read privilege of entries must be enabled
  const formattedPermGroups = permGroups
    .map((permGroup) => permGroupDbToForm(permGroup.privileges, permGroup.slug))
    .reduce((acc, currentObj) => {
      const key = Object.keys(currentObj)[0]
      acc[key] = currentObj[key]
      return acc
    }, {})
  const form = useForm({
    defaultValues: {
      privileges: { ...formattedPermGroups }
    },
    validators: {},
    onSubmit: async ({ value }) => {
      try {
        let response = await updatePermissionGroups(value)
        if (response.success) {
          toast.success("Successful!", {
            description: `Permission Groups Settings has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white"
          })
        } else {
          toast.error(`Failed to update permission groups settings. Please try again.`, {
            position: "top-center"
          })
        }
      } catch (error) {
        toast.error("Form submission error", {
          position: "top-center"
        })
      }
    }
  })

  console.log("FORMVALUESSS: ", form.state.values)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
      <div className="flex mt-5 min-w-300">
        <PrivilegesSettings form={form} permGroups={permGroups} namespaces={namespaces} mode={FormMode.EDIT} />
      </div>
    </form>
  )
}
export default PermissionGroupSettingsForm
