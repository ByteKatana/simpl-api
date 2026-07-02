"use client"

import { useForm } from "@tanstack/react-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { GeneralSettingsFormSchema } from "@/lib/schemas/client/form-schemas"
import { toast } from "sonner"
import updateGeneralSettings from "@/lib/actions/studio/settings/update-general-settings"
import { Switch } from "@/components/ui/switch"
import InfoTooltip from "@/components/studio/info-tooltip"
import { MessageSquareWarning } from "lucide-react"
import { GeneralSettings } from "@/interfaces/settings"
import { DbDriver } from "@/interfaces"

const GeneralSettingsForm = ({ formValues }: { formValues: GeneralSettings }) => {
  const { id, settings } = formValues
  const form = useForm({
    defaultValues: settings,
    validators: {
      onMount: GeneralSettingsFormSchema,
      onChange: GeneralSettingsFormSchema,
      onSubmit: GeneralSettingsFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await updateGeneralSettings(value, id?.toString() || "")
        if (response.success) {
          toast.success("Successful!", {
            description: `General Settings has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white"
          })
        } else {
          toast.error(`Failed to update general settings. Please try again.`, {
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
    <div className="flex mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-y-5">
        <Field>
          <FieldLabel htmlFor="site_name">Site Name</FieldLabel>
          <form.Field name="site_name">
            {(field) => (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder="My Awesome Site"
                className="bg-input"
                onChange={(e) => field.handleChange(e.target.value)}
                aria-label={"Site Name"}
              />
            )}
          </form.Field>
        </Field>
        <Field className="flex flex-row items-center justify-between gap-x-4">
          <FieldLabel htmlFor="maintenance_mode">Maintenance Mode</FieldLabel>
          <form.Field name="maintenance_mode">
            {(field) => (
              <Switch
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
            )}
          </form.Field>
        </Field>
        <Field>
          <FieldLabel htmlFor="maintenance_msg">Maintenance Message</FieldLabel>
          <form.Field name="maintenance_msg">
            {(field) => (
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder="Maintenance message..."
                className="bg-input"
                onChange={(e) => field.handleChange(e.target.value)}
                aria-label={"Maintenance Message"}
              />
            )}
          </form.Field>
        </Field>
        <Field>
          <FieldLabel className="flex gap-x-2 items-center" htmlFor="db_driver">
            <span>Database Driver</span>
            <InfoTooltip
              icon={<MessageSquareWarning size={14} />}
              message={"Some options of this feature still under development"}
              animate={true}
            />
          </FieldLabel>
          <form.Field name="db_driver">
            {(field) => (
              <Select
                name={field.name}
                value={field.state.value as string}
                defaultValue={"mongo"}
                onValueChange={(value) => field.handleChange(value as DbDriver)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"mongo"}>MongoDB</SelectItem>
                    <SelectItem disabled value={"pg"}>
                      PostgresSQL
                    </SelectItem>
                    <SelectItem disabled value={"mysql"}>
                      mySQL / MariaDB
                    </SelectItem>
                    <SelectItem disabled value={"mssql"}>
                      Microsoft SQL Server
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </form.Field>
        </Field>
        <FormSubmitResetBtn form={form} />
      </form>
    </div>
  )
}
export default GeneralSettingsForm
