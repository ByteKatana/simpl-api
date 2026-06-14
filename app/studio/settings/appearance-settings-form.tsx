"use client"

import { useForm } from "@tanstack/react-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { z } from "zod"
import { AppearanceSettingsSchema } from "@/lib/schemas/server/server-schemas"
import { AppearanceSettingsFormSchema } from "@/lib/schemas/client/form-schemas"
import { toast } from "sonner"
import updateAppearanceSettings from "@/lib/actions/studio/settings/update-appearance-settings"

const AppearanceSettingsForm = ({ formValues }: { formValues: z.infer<typeof AppearanceSettingsSchema> }) => {
  const { id, settings } = formValues
  const form = useForm({
    defaultValues: settings,
    validators: {
      onMount: AppearanceSettingsFormSchema,
      onChange: AppearanceSettingsFormSchema,
      onSubmit: AppearanceSettingsFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response = await updateAppearanceSettings(value, id?.toString() || "")
        if (response.success) {
          toast.success("Successful!", {
            description: `Apperance Settings has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white"
          })
        } else {
          toast.error(`Failed to update apperance settings. Please try again.`, {
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
          <FieldLabel className="text-base font-base font-sans" htmlFor="mode">
            Default Mode
          </FieldLabel>
          <form.Field name="mode">
            {(field: any) => (
              <Select
                name={field.name}
                value={field.state.value as string}
                defaultValue={"light"}
                onValueChange={(value) => field.handleChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"light"}>Light Mode</SelectItem>
                    <SelectItem value={"dark"}>Dark Mode</SelectItem>
                    <SelectItem value={"system"}>System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </form.Field>
        </Field>
        {/* @ts-ignore */}
        <FormSubmitResetBtn form={form} />
      </form>
    </div>
  )
}
export default AppearanceSettingsForm
