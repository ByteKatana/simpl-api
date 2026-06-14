"use client"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormRenderer } from "@/components/studio/form-renderer"
import { toast } from "sonner"
import { ActionResponse, FormMode, PublishStatus } from "@/interfaces"
import { EntryType } from "@/interfaces/entry_type"
import { EntryCreateFormSchema } from "@/lib/schemas/client/form-schemas"
import createEntry from "@/lib/actions/studio/entry/create-entry"
import { useRouter } from "next/navigation"
import { Undo2Icon } from "lucide-react"
import { Entry, EntryFormValues } from "@/interfaces/entry"
import StatusRadioGroup from "@/components/studio/status-radio-group"
import z from "zod"
import FieldErrorText from "@/components/studio/field-error-text"
import { NextResponse } from "next/server"
import updateEntry from "@/lib/actions/studio/entry/update-entry"

type Props = {
  entryTypes: EntryType[]
  mode: FormMode
  formPayload?: Entry
}

export const { fieldContext, formContext, useFormContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {
    FormRenderer
  }
})

const EntryForm = ({ entryTypes, mode, formPayload }: Props) => {
  const router = useRouter()
  // The specific entry type is the last one in the hierarchy
  const specificEntryType = entryTypes[entryTypes.length - 1]

  const buildDataSchema = (types: EntryType[]) => {
    const dataShape: Record<string, z.ZodTypeAny> = {}

    types.forEach((type) => {
      type.fieldsets.forEach((row: any) => {
        const groupShape: Record<string, z.ZodTypeAny> = (dataShape[row.instanceId] as any)?._def?.shape() || {}

        row.fields.forEach((f: any) => {
          let s: z.ZodTypeAny

          switch (f.type) {
            case "Checkbox":
              s = z.boolean().refine((v) => (f.required ? v : true), {
                message: `${f.label || f.name} is required`
              })
              break

            case "Number":
              s = z
                .union([z.string(), z.number()])
                .refine((v) => v !== "" && v !== null && v !== undefined, {
                  message: `${f.label || f.name} is required`
                })
                .transform((v) => Number(v))
                .refine((v) => !Number.isNaN(v), {
                  message: `${f.label || f.name} is required`
                })
              break

            default: {
              let str = z.string()
              if (f.required) {
                str = str.min(1, { message: `${f.label || f.name} is required` })
              }

              if (f.validation?.minLength)
                str = str.min(f.validation.minLength, {
                  message: `${f.label || f.name} must be at least ${f.validation.minLength} characters`
                })
              if (f.validation?.maxLength)
                str = str.max(f.validation.maxLength, {
                  message: `${f.label || f.name} can be at most ${f.validation.maxLength} characters`
                })
              if (f.validation?.pattern) str = str.regex(new RegExp(f.validation.pattern))
              s = str
            }
          }

          groupShape[f.name] = s
        })

        dataShape[row.instanceId] = z.object(groupShape)
      })
    })

    return z.object(dataShape)
  }

  const FullSchema = EntryCreateFormSchema.extend({
    data: buildDataSchema(entryTypes)
  })

  // Combine all fieldsets from all entry types
  const allFieldsets = entryTypes.flatMap((t) => t.fieldsets as any[])

  const initialData = allFieldsets.reduce(
    (acc, row) => {
      if (!acc[row.instanceId]) acc[row.instanceId] = {}

      if (mode === FormMode.EDIT && formPayload?.data?.[row.instanceId]) {
        row.fields.forEach((f: any) => {
          acc[row.instanceId][f.name] = formPayload.data[row.instanceId][f.name] ?? (f.type === "Checkbox" ? false : "")
        })
      } else {
        row.fields.forEach((f: any) => {
          acc[row.instanceId][f.name] = f.type === "Checkbox" ? false : ""
        })
      }

      return acc
    },
    {} as Record<string, string | string[] | object | object[]>
  )

  // set default payload for default form values
  let defaultPayload: EntryFormValues & { data: typeof initialData }
  if (mode === FormMode.EDIT && formPayload) {
    defaultPayload = {
      name: formPayload.name,
      status: formPayload.status,
      data: initialData
    }
  } else {
    defaultPayload = {
      name: "",
      status: PublishStatus.Draft,
      data: initialData
    }
  }

  const form = useAppForm({
    defaultValues: defaultPayload,
    validators: {
      onSubmit: FullSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response: ActionResponse
        if (mode === FormMode.EDIT && formPayload) {
          response = await updateEntry(value, formPayload._id.toString())
        } else {
          response = await createEntry(value as EntryFormValues, specificEntryType)
        }

        if (response.success) {
          toast.success("Successful!", {
            description: `Entry has been ${mode === FormMode.EDIT ? "updated" : "created"} successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white",
            action: {
              label: (
                <span className="flex items-center gap-x-1">
                  <Undo2Icon size={14} /> <span>Return back</span>
                </span>
              ),
              onClick: () => router.push("/studio/entries")
            }
          })
        } else {
          toast.error(`Failed to ${mode === FormMode.EDIT ? "update" : "create"} entry. Please try again.`, {
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
    <form.AppForm>
      <div className="space-y-6 py-10">
        {/* Entry Name */}
        <Field>
          <FieldLabel htmlFor="name">Entry Name</FieldLabel>
          <form.AppField
            validators={{
              onChangeAsyncDebounceMs: 2000,
              onChangeAsync: EntryCreateFormSchema.shape.name,
              onBlur: EntryCreateFormSchema.shape.name
            }}
            name="name">
            {(field) => (
              <>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="My new entry"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldErrorText field={field} />
              </>
            )}
          </form.AppField>
          <FieldError />
        </Field>

        {/* Status */}
        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <form.AppField
            validators={{
              onChangeAsyncDebounceMs: 1500,
              onChangeAsync: EntryCreateFormSchema.shape.status,
              onBlur: EntryCreateFormSchema.shape.status
            }}
            name="status">
            {(field) => (
              <>
                <StatusRadioGroup field={field} />
                <FieldErrorText field={field} />
              </>
            )}
          </form.AppField>
        </Field>

        {/* Dynamic fields rendered from fetched entry type structure */}
        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">{entryTypes.map((t) => t.name).join(" > ")} Fields</legend>
          <Field>
            <form.FormRenderer context={useFormContext} rows={allFieldsets} />
          </Field>
        </fieldset>

        {/* Actions */}
        <div className="flex gap-x-4 items-center justify-start">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.values.data]}
            children={([canSubmit, isSubmitting, data]) => {
              const allFilled = Object.values(data as Record<string, Record<string, unknown>>).every((group) =>
                Object.values(group).every((v) => v !== "" && v !== null && v !== undefined && v !== false)
              )

              return (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                  type="submit"
                  disabled={!canSubmit || !allFilled || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )
            }}
          />
          <Button
            type="button"
            onClick={() => {
              form.reset()
            }}>
            Reset
          </Button>
        </div>
      </div>
    </form.AppForm>
  )
}

export default EntryForm
