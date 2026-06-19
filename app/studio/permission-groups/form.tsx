"use client"

import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ActionResponse, DbPrivilege, FormMode } from "@/interfaces"
import PrivilegesSettings from "@/components/studio/permission-groups/privileges-settings"
import { EntryType } from "@/interfaces/entry_type"
import { PermissionGroupFormSchema } from "@/lib/schemas/client/form-schemas"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import createPermissionGroup from "@/lib/actions/studio/permission-groups/create-permission-group"
import { toast } from "sonner"
import { Undo2Icon } from "lucide-react"
import { z } from "zod"
import { permGroupDbToForm } from "@/lib/db-to-form"
import updatePermissionGroup from "@/lib/actions/studio/permission-groups/update-permission-group"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { PermissionGroup } from "@/interfaces/permission_group"
import { slugifyName } from "@/lib/slugify"

type Props = {
  namespaces: EntryType[]
  permGroups?: PermissionGroup[]
  mode: FormMode
  formPayload?: {
    _id: any
    name: string
    slug: string
    privileges: DbPrivilege[]
  }
}

const PermissionGroupForm = ({ namespaces, mode, permGroups, formPayload }: Props) => {
  const router = useRouter()
  const [showEmptyWarning, setShowEmptyWarning] = useState(false)
  const [pendingValue, setPendingValue] = useState<any>(null)
  let defaultPayload: z.infer<typeof PermissionGroupFormSchema> = {
    name: "new group",
    privileges: {
      new_group: {
        system: {},
        namespaces: {}
      }
    }
  }

  if (mode === FormMode.EDIT && formPayload) {
    defaultPayload = {
      name: formPayload.name,
      privileges: permGroupDbToForm(formPayload.privileges, formPayload.slug)
    }
  }

  const handleConfirmedSubmit = async (value: any) => {
    try {
      let response: ActionResponse
      if (mode === FormMode.EDIT && formPayload) {
        response = await updatePermissionGroup(value, formPayload._id.toString())
      } else {
        response = await createPermissionGroup(value)
      }
      if (response.success) {
        toast.success("Successful!", {
          description: `Permission Group has been ${mode === FormMode.EDIT ? "updated" : "created"} successfully!`,
          position: "top-center",
          className: "bg-emerald-500 text-white",
          action: {
            label: (
              <span className="flex items-center gap-x-1">
                <Undo2Icon size={14} /> <span>Return back</span>
              </span>
            ),
            onClick: () => router.push("/studio/permission-groups")
          }
        })
      } else {
        toast.error(`Failed to ${mode === FormMode.EDIT ? "update" : "create"} permission group. Please try again.`, {
          position: "top-center"
        })
      }
    } catch (error) {
      toast.error("Form submission error", {
        position: "top-center"
      })
    }
  }

  const form = useForm({
    defaultValues: defaultPayload,
    validators: {
      onChange: PermissionGroupFormSchema,
      onSubmit: PermissionGroupFormSchema
    },
    onSubmit: async ({ value }) => {
      const slug = slugifyName(value.name)
      const privileges = value.privileges?.[slug]

      const hasAnyTrueAction = (resources: Record<string, Record<string, boolean>> | undefined) => {
        if (!resources) return false
        return Object.values(resources).some((actions) => Object.values(actions).some((v) => v))
      }

      const systemEmpty = !hasAnyTrueAction(privileges?.system)
      const namespacesEmpty = !hasAnyTrueAction(privileges?.namespaces)

      if (systemEmpty && namespacesEmpty) {
        setPendingValue(value)
        setShowEmptyWarning(true)
        return
      }

      handleConfirmedSubmit(value)
    }
  })

  //TODO: Edit mode logic will be here

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6 py-10">
        <Field>
          <FieldLabel htmlFor="name">Permission Group Name</FieldLabel>
          <form.Field
            name={"name"}
            children={(field) => (
              <>
                <Input
                  id={field.name}
                  name={field.name}
                  aria-label={`type={${field.name}}`}
                  placeholder="My Group"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </>
            )}
          />
        </Field>
        <Field>
          <PrivilegesSettings form={form} mode={mode} permGroups={permGroups} namespaces={namespaces} />
        </Field>

        {/* Actions */}
        <div className="flex gap-x-4 items-center justify-start">
          <FormSubmitResetBtn form={form} />
        </div>
      </form>
      <AlertDialog open={showEmptyWarning} onOpenChange={setShowEmptyWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Privileges Assigned</AlertDialogTitle>
            <AlertDialogDescription>
              No privileges have been assigned to this permission group. Do you want to create it without any
              privileges?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValue(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingValue) {
                  handleConfirmedSubmit(pendingValue)
                  setPendingValue(null)
                }
              }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
export default PermissionGroupForm
