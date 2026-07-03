"use client"
import { useForm } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BuilderCanvas } from "@/components/studio/entry-types/builder-canvas"
import { toast } from "sonner"
import { PublishStatus } from "@/interfaces"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntryTypeFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Undo2Icon } from "lucide-react"
import StatusRadioGroup from "@/components/studio/status-radio-group"
import createEntryType from "@/lib/actions/studio/entry-types/create-entry-type"

const EntryTypeCreateForm = ({ namespaces }: { namespaces: string[] }) => {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: "",
      namespace: "itself",
      status: PublishStatus.Draft,
      fieldsets: []
    } as z.infer<typeof EntryTypeFormSchema>,
    validators: {
      onMount: EntryTypeFormSchema,
      onChange: EntryTypeFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await createEntryType(value)
        if (response.status === 200) {
          toast.success("Successful!", {
            description: "Entry type has been created successfully!",
            position: "top-center",
            className: "bg-emerald-500 text-white",
            action: {
              label: (
                <span className="flex items-center gap-x-1">
                  <Undo2Icon size={14} /> <span>Return back</span>
                </span>
              ),
              onClick: () => router.push("/studio/entry-types")
            }
          })
        } else {
          toast.error("Failed to create entry type. Please try again.", { position: "top-center" })
        }
      } catch (error) {
        console.error("Form submission error", error)
      }
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6 py-10">
      <Field>
        <FieldLabel htmlFor="name">Entry Type Name</FieldLabel>
        <form.Field name={"name"}>
          {(field) => (
            <Input
              id={field.name}
              name={field.name}
              placeholder="Orange Juice"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>

        <FieldError />
      </Field>
      <Field>
        <FieldLabel htmlFor="namespace">Namespace</FieldLabel>
        <form.Field name={"namespace"}>
          {(field) => (
            <Select value={field.state.value} defaultValue={"itself"} onValueChange={field.handleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"Select namespace"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem key={"itself"} value={"itself"}>
                    Itself
                  </SelectItem>
                  {namespaces.map((ns) => (
                    <SelectItem key={ns} value={ns}>
                      {ns}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </form.Field>
        <FieldError />
      </Field>
      <Field>
        <FieldLabel htmlFor="status">Status</FieldLabel>
        <form.Field name={"status"}>{(field) => <StatusRadioGroup field={field} />}</form.Field>
      </Field>
      <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
        <legend className="text-lg font-semibold">Field Details</legend>
        <form.Field name={"fieldsets"}>
          {(field) => <BuilderCanvas value={field.state.value} onChange={(val) => field.handleChange(val)} />}
        </form.Field>
      </fieldset>
      <div className="flex gap-x-4 items-center justify-start">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="cursor-default hover:cursor-pointer"
              type="submit"
              disabled={!canSubmit}
              /*onClick={form.handleSubmit}*/
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        />
        <Button
          type="button"
          onClick={() => {
            form.reset()
          }}>
          Reset
        </Button>
      </div>
    </form>
  )
}
export default EntryTypeCreateForm
