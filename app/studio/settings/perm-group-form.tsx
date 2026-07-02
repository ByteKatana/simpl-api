"use client"
import PrivilegesSettings from "@/components/studio/permission-groups/privileges-settings"
import { useForm } from "@tanstack/react-form"
import { FormMode } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { EntryType } from "@/interfaces/entry_type"
import { permGroupDbToForm } from "@/lib/db-to-form"
import { toast } from "sonner"
import updatePermissionGroups from "@/lib/actions/studio/permission-groups/update-permission-groups"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"

type Props = {
  permGroups: PermissionGroup[]
  namespaces: EntryType[]
}

const PermissionGroupSettingsForm = ({ permGroups, namespaces }: Props) => {
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
        const response = await updatePermissionGroups(value)
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
      <FormSubmitResetBtn form={form} />
    </form>
  )
}
export default PermissionGroupSettingsForm
