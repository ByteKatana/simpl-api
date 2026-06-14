"use client"
import { useRouter } from "next/navigation"
import { UserStatus } from "@/interfaces"
import { toast } from "sonner"
import { Undo2Icon } from "lucide-react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import FieldErrorText from "@/components/studio/field-error-text"
import { Button } from "@/components/ui/button"
import { useForm, uuid } from "@tanstack/react-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCreateFormSchema } from "@/lib/schemas/client/form-schemas"
import createEntry from "@/lib/actions/studio/entry/create-entry"
import { EntryFormValues } from "@/interfaces/entry"
import createUser from "@/lib/actions/studio/users/create-user"
import { z } from "zod"

const UserCreateForm = () => {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      email: "",
      profile_img: "",
      permission_group: "viewer",
      status: UserStatus.Active
    } as z.infer<typeof UserCreateFormSchema>,
    validators: {
      onMount: UserCreateFormSchema,
      onChangeAsyncDebounceMs: 2500,
      onChangeAsync: UserCreateFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        //TODO: Fix type missmatch (TS2339) on response variable
        const response = await createUser(value)
        if (response.success) {
          toast.success("Successful!", {
            description: "User has been created successfully!",
            position: "top-center",
            className: "bg-emerald-500 text-white",
            action: {
              label: (
                <span className="flex items-center gap-x-1">
                  <Undo2Icon size={14} /> <span>Return back</span>
                </span>
              ),
              onClick: () => router.push("/studio/users")
            }
          })
        } else {
          toast.error(response.message, { position: "top-center" })
        }
      } catch (error) {
        toast.error("An error occurred while creating the user", { position: "top-center" })
      }
    }
  })

  return (
    <form>
      <div className="space-y-6 py-10">
        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">Basic Info</legend>
          {/* Username */}
          <Field>
            <FieldLabel htmlFor="name">Username</FieldLabel>
            <form.Field name="username">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="New username"
                    value={field.state.value}
                    required={true}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
            <FieldError />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <form.Field name="email">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    type={"email"}
                    name={field.name}
                    required={true}
                    placeholder="johndoe@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>
          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <form.Field name="password">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    type={"password"}
                    name={field.name}
                    required={true}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">Personal Info</legend>
          {/* Fullname */}
          <Field>
            <FieldLabel htmlFor="fullname">Fullname</FieldLabel>
            <form.Field name="fullname">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    type={"text"}
                    name={field.name}
                    placeholder="John Doe"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>
        </fieldset>
        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">Account Settings</legend>
          {/* Permission Group */}
          <Field>
            <FieldLabel htmlFor="permission_group">Permission Group</FieldLabel>
            <form.Field name="permission_group">
              {(field) => (
                <Select name={field.name} defaultValue={"viewer"} onValueChange={(val) => field.handleChange(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a permission group"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"admin"} value={"admin"}>
                      Admin
                    </SelectItem>
                    <SelectItem key={"editor"} value={"editor"}>
                      Editor
                    </SelectItem>
                    <SelectItem key={"viewer"} value={"viewer"}>
                      Viewer
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </Field>
        </fieldset>

        {/* Actions */}
        <div className="flex gap-x-4 items-center justify-start">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => {
              return (
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                  type="submit"
                  disabled={!canSubmit}>
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
    </form>
  )
}

export default UserCreateForm
