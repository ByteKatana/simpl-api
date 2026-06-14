"use client"

import { useRouter } from "next/navigation"
import { FormMode, UserStatus } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { toast } from "sonner"
import { Undo2Icon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import FieldErrorText from "@/components/studio/field-error-text"
import { Button } from "@/components/ui/button"
import { useForm } from "@tanstack/react-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormSchema, UserUpdateFormSchema } from "@/lib/schemas/client/form-schemas"
import createUser from "@/lib/actions/studio/users/create-user"
import updateUser from "@/lib/actions/studio/users/update-user"
import { AvatarSelector } from "@/components/studio/users/avatar-selector"
import { useState } from "react"
import { User } from "@/interfaces/user"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { z } from "zod"
import UserStatusRadioGroup from "@/components/studio/user-status-radio-group"

type Props = {
  mode: FormMode
  profileImgProvider: string
  permGroups: PermissionGroup[]
  formPayload?: User
}

const UserForm = ({ mode, profileImgProvider, permGroups, formPayload }: Props) => {
  const router = useRouter()
  const [debouncedUsername, setDebouncedUsername] = useState(formPayload?.username || "")
  const [debouncedEmail, setDebouncedEmail] = useState(formPayload?.email || "")

  const isEdit = mode === FormMode.EDIT

  let defaultPayload: z.infer<typeof UserFormSchema> | z.infer<typeof UserUpdateFormSchema> = {
    username: "",
    fullname: "",
    password: "",
    email: "",
    profile_img: "",
    permission_group: "viewer",
    status: UserStatus.Disabled
  }

  if (isEdit && formPayload) {
    defaultPayload = {
      username: formPayload.username,
      fullname: formPayload.fullname,
      password: formPayload.password ? formPayload.password : "",
      email: formPayload.email,
      profile_img: formPayload.profile_img,
      permission_group: formPayload.permission_group,
      status: formPayload.status
    }
  }

  const form = useForm({
    defaultValues: defaultPayload,
    validators: {
      onMount: isEdit ? UserUpdateFormSchema : UserFormSchema,
      onChangeAsyncDebounceMs: 2500,
      onChangeAsync: isEdit ? UserUpdateFormSchema : UserFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response: any
        if (isEdit && formPayload?._id) {
          // updateUser expects an array of users and the current password for comparison
          response = await updateUser(value as User, formPayload, formPayload._id.toString())
        } else {
          response = await createUser(value as User)
        }

        if (response.success) {
          toast.success("Successful!", {
            description: `User has been ${isEdit ? "updated" : "created"} successfully!`,
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
          toast.error(response.message || `Failed to ${isEdit ? "update" : "create"} user.`, {
            position: "top-center"
          })
        }
      } catch (error) {
        toast.error(`An error occurred while ${isEdit ? "updating" : "creating"} the user`, {
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
      <div className="space-y-6 py-10">
        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">Basic Info</legend>
          {/* Username */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <form.Field
              listeners={{
                onChangeDebounceMs: 500,
                onChange: ({ value }) => setDebouncedUsername(value)
              }}
              name="username">
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
                    aria-label={"Username"}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <form.Field
              listeners={{
                onChangeDebounceMs: 500,
                onChange: ({ value }) => setDebouncedEmail(value)
              }}
              name="email">
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
                    aria-label={"Email"}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">
              {isEdit ? "New Password (leave blank to keep current)" : "Password"}
            </FieldLabel>
            <form.Field name="password">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    type={"password"}
                    name={field.name}
                    required={!isEdit}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-label={"Password"}
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <form.Field name={"status"}>{(field) => <UserStatusRadioGroup field={field} />}</form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile_img">Profile Image {isEdit && `(leave as is to keep current)`} </FieldLabel>

            <form.Field name="profile_img">
              {(field) => (
                <div className="flex flex-col gap-y-5">
                  {isEdit && (
                    <Avatar size="lg" className="shrink-0 border">
                      <AvatarImage alt={`${form.state.values.username}'s profile image`} src={field.state.value} />
                    </Avatar>
                  )}
                  <AvatarSelector
                    provider={profileImgProvider}
                    username={debouncedUsername}
                    email={debouncedEmail}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                  />
                </div>
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
                    aria-label={"Fullname"}
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
                <Select name={field.name} value={field.state.value} onValueChange={(val) => field.handleChange(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select a permission group"} />
                  </SelectTrigger>
                  <SelectContent>
                    {permGroups
                      .filter((pg) => pg.slug !== "viewer")
                      .map((group) => (
                        <SelectItem key={group.slug} value={group.slug}>
                          {group.name}
                        </SelectItem>
                      ))}
                    <SelectItem key="viewer" value="viewer">
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
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          />
          <Button type="button" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </div>
    </form>
  )
}

export default UserForm
