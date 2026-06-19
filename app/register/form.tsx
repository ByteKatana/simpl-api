"use client"

import { useForm } from "@tanstack/react-form"
import { UserFormSchema } from "@/lib/schemas/client/form-schemas"
import { UserStatus } from "@/interfaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import FieldErrorText from "@/components/studio/field-error-text"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { User } from "@/interfaces/user"
import createUser from "@/lib/actions/studio/users/create-user"
import { useRouter } from "next/navigation"
import { AvatarSelector } from "@/components/studio/users/avatar-selector"
import { useState } from "react"
import { EmailVerificationAction } from "@/lib/actions/auth/email-verification"
import { VerificationForm } from "./email-verification-form"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"

type Props = {
  profileImgProvider: string
}

export default function RegisterForm({ profileImgProvider }: Props) {
  // Routing
  const router = useRouter()

  // Local states
  const [debouncedUsername, setDebouncedUsername] = useState("")
  const [debouncedEmail, setDebouncedEmail] = useState("")
  const [step, setStep] = useState<"register" | "verify">("register")
  const [userEmail, setUserEmail] = useState("")

  const form = useForm({
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      email: "",
      profile_img: "",
      permission_group: "viewer",
      status: UserStatus.Active
    },
    validators: {
      onChange: UserFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response = await createUser(value as User, true)
        const isEmailVerificationEnabled: boolean = await getSettingsValue("identity_settings", "email_verification")

        if (response.success) {
          if (isEmailVerificationEnabled) {
            const responseVerify = await EmailVerificationAction(value.email)
            if (responseVerify.success) {
              setUserEmail(value.email)
              setStep("verify")
              toast.success("Successful!", {
                description: `Please check your email for the verification code!`,
                position: "top-center",
                className: "bg-emerald-500 text-white"
              })
            }
          } else {
            toast.success("Successful!", {
              description: `Account created successfully!`,
              position: "top-center",
              className: "bg-emerald-500 text-white"
            })
            router.push("/login")
          }
        } else {
          toast.error(
            (response.error && response.error.message) || `An error occurred while registering your account.`,
            {
              position: "top-center"
            }
          )
        }
      } catch (error) {
        toast.error(`An error occurred while registering your account.`, {
          position: "top-center"
        })
      }
    }
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      {step === "register" ? (
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to register.</CardDescription>
        </CardHeader>
      ) : (
        <CardHeader>
          <CardTitle>Verify your Email Address</CardTitle>
          <CardDescription>Please verify your email address to complete registration.</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        {step === "register" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4">
            <Field>
              <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
              <form.Field name="fullname">
                {(field) => (
                  <>
                    <Input
                      id={field.name}
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-label={"Full Name"}
                    />
                    <FieldErrorText field={field} />
                  </>
                )}
              </form.Field>
            </Field>

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
                      placeholder="johndoe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-label={"Username"}
                    />
                    <FieldErrorText field={field} />
                  </>
                )}
              </form.Field>
            </Field>

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
                      type="email"
                      placeholder="john@example.com"
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

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <form.Field name="password">
                {(field) => (
                  <>
                    <Input
                      id={field.name}
                      type="password"
                      placeholder="********"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-label={"Register"}
                    />
                    <FieldErrorText field={field} />
                  </>
                )}
              </form.Field>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile_img">Profile Image</FieldLabel>

              <form.Field name="profile_img">
                {(field) => (
                  <div className="flex flex-col gap-y-5">
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

            <div className="grid grid-cols-2 gap-4"></div>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        ) : (
          <VerificationForm
            email={userEmail}
            onSuccess={() => {
              toast.success("Successful!", {
                description: `Account created successfully!`,
                position: "top-center",
                className: "bg-emerald-500 text-white"
              })
              router.push("/login")
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
