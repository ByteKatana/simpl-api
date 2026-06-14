"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Undo2Icon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import FieldErrorText from "@/components/studio/field-error-text"
import { Button } from "@/components/ui/button"
import { useForm } from "@tanstack/react-form"
import { UserUpdateFormSchema } from "@/lib/schemas/client/form-schemas"
import updateUser from "@/lib/actions/studio/users/update-user"
import { AvatarSelector } from "@/components/studio/users/avatar-selector"
import { useState } from "react"
import { User } from "@/interfaces/user"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

type Props = {
  profileImgProvider: string
  formPayload: User
}

const ProfileForm = ({ profileImgProvider, formPayload }: Props) => {
  const router = useRouter()
  const [debouncedUsername, setDebouncedUsername] = useState(formPayload?.username || "")
  const [debouncedEmail, setDebouncedEmail] = useState(formPayload?.email || "")

  const form = useForm({
    defaultValues: {
      username: formPayload.username,
      fullname: formPayload.fullname,
      password: "",
      email: formPayload.email,
      profile_img: formPayload.profile_img,
      permission_group: formPayload.permission_group,
      status: formPayload.status
    },
    validators: {
      onMount: UserUpdateFormSchema as any,
      onChangeAsyncDebounceMs: 2500,
      onChangeAsync: UserUpdateFormSchema as any
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await updateUser(value as User, formPayload, formPayload._id?.toString() || "")

        if (response.success) {
          toast.success("Successful!", {
            description: `Your profile has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white",
            action: {
              label: (
                <span className="flex items-center gap-x-1">
                  <Undo2Icon size={14} /> <span>Return back</span>
                </span>
              ),
              onClick: () => router.push("/studio")
            }
          })
        } else {
          toast.error(response.message || `Failed to update your profile.`, {
            position: "top-center"
          })
        }
      } catch (error) {
        toast.error(`An error occurred while updating your profile`, {
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
          <Field>
            <FieldLabel htmlFor="profile_img">Profile Image (leave as is to keep current) </FieldLabel>

            <form.Field name="profile_img">
              {(field) => (
                <div className="flex flex-col gap-y-5">
                  <Avatar size="lg" className="shrink-0 border">
                    <AvatarImage alt={`Users's profile image`} src={field.state.value} />
                  </Avatar>
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
                    disabled
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
                    disabled
                  />
                  <FieldErrorText field={field} />
                </>
              )}
            </form.Field>
          </Field>
        </fieldset>
        <fieldset className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          <legend className="text-lg font-semibold">Password & Security</legend>
          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">New Password (leave blank to keep current)</FieldLabel>
            <form.Field name="password">
              {(field) => (
                <>
                  <Input
                    id={field.name}
                    type={"password"}
                    name={field.name}
                    required={false}
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
          {/*<Field>
            <FieldLabel htmlFor="password">Add Passkey</FieldLabel>
            <button
              onClick={() => signIn("passkey", { action: "register" })}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded">
              Register New Security Key
            </button>
          </Field>*/}
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

export default ProfileForm
