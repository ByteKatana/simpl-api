// "use client"

import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { SetupFormValues } from "@/interfaces"
import { SetupFormSchema } from "@/lib/schemas/client/form-schemas"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"

export default function SetupForm({
  onInitiate
}: {
  onInitiate: (values: SetupFormValues) => void
  isSubmitting: boolean
}) {
  const form = useForm({
    defaultValues: {
      ADMIN_FULLNAME: "SirAdmin",
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD: "",
      ADMIN_EMAIL: ""
    } as SetupFormValues,
    validators: {
      onMount: SetupFormSchema,
      onChange: SetupFormSchema
    },
    onSubmit: ({ value }) => {
      onInitiate(value)
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4">
      <form.Field name="ADMIN_FULLNAME">
        {(field) => (
          <Field>
            <FieldLabel>Admin Fullname</FieldLabel>
            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="ADMIN_USERNAME">
        {(field) => (
          <Field>
            <FieldLabel>Admin Username</FieldLabel>
            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="ADMIN_EMAIL">
        {(field) => (
          <Field>
            <FieldLabel>Admin Email</FieldLabel>
            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="ADMIN_PASSWORD">
        {(field) => (
          <Field>
            <FieldLabel>Admin Password</FieldLabel>
            <Input type="password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>

      <FormSubmitResetBtn form={form} />
    </form>
  )
}
