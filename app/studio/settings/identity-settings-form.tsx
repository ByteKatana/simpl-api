"use client"

import { useForm } from "@tanstack/react-form"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  SiApple,
  SiAtlassian,
  SiBitbucket,
  SiClickup,
  SiGithub,
  SiGitlab,
  SiGoogle,
  SiHuggingface,
  SiLinkedin,
  SiMaildotru,
  SiNetlify,
  SiNotion,
  SiSlack,
  SiVercel,
  SiYandexcloud,
  SiZoom
} from "react-icons/si"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { PermissionGroup } from "@/interfaces/permission_group"
import { z } from "zod"
import { IdentitySettingsFormSchema } from "@/lib/schemas/client/form-schemas"
import { toast } from "sonner"
import updateIdentitySettings from "@/lib/actions/studio/settings/update-identity-setttings"
import { IdentitySettingsSchema } from "@/lib/schemas/server/server-schemas"
import InfoTooltip from "@/components/studio/info-tooltip"
import { MessageSquareWarning } from "lucide-react"

type Props = {
  formValues: z.infer<typeof IdentitySettingsSchema>
  permGroups: PermissionGroup[]
}

const IdentitySettingsForm = ({ formValues, permGroups }: Props) => {
  const { id, settings } = formValues
  const form = useForm({
    defaultValues: settings,
    validators: {
      onMount: IdentitySettingsFormSchema,
      onChange: IdentitySettingsFormSchema,
      onSubmit: IdentitySettingsFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response = await updateIdentitySettings(value, id?.toString() || "")
        if (response.success) {
          toast.success("Successful!", {
            description: `Identity Settings has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white"
          })
        } else {
          toast.error(`Failed to update identity settings. Please try again.`, {
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
        className="flex flex-col gap-y-10">
        <Field>
          <FieldLabel className={"flex gap-x-2 items-center text-lg font-base font-sans"} htmlFor="management_mode">
            <span>Identity Management</span>
            <InfoTooltip
              icon={<MessageSquareWarning size={14} />}
              message={"Some options of this feature still under development"}
              animate={true}
            />
          </FieldLabel>
          <form.Field name="management_mode">
            {(field) => (
              <Select
                name={field.name}
                value={field.state.value}
                defaultValue={"built-in"}
                onValueChange={(value) => field.handleChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"built-in"}>
                      <span className="text-sm text-muted-foreground">
                        Use the built-in identity management system.
                      </span>
                    </SelectItem>
                    <SelectItem disabled={true} value={"third-party"}>
                      <span className="text-sm text-muted-foreground">
                        Use a third-party identity management system.
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </form.Field>
        </Field>
        <div className="flex flex-col gap-y-5">
          <h4 className="text-lg font-base font-sans leading-none">Authentication Methods</h4>
          <p className="text-xs text-muted-foreground">Choose how users can authenticate with your application.</p>
          <fieldset className="flex flex-col space-y-4">
            <legend className="flex items-center gap-x-2 text-base leading-none">
              <span>Built-in Methods</span>
              <InfoTooltip
                icon={<MessageSquareWarning size={14} />}
                message={"Some options of this feature still under development"}
                animate={true}
              />
            </legend>
            <FieldGroup className="w-full max-w-sm">
              <FieldLabel htmlFor="auth_methods.built_in.email_pw">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.built_in.email_pw"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle>Email & Password</FieldTitle>
                          <FieldDescription>Use email and password for authentication.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="auth_methods.built_in.passkeys">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.built_in.passkeys"}>
                    {(field) => (
                      <>
                        <FieldContent className={"text-muted-foreground"}>
                          <FieldTitle>Passkeys</FieldTitle>
                          <FieldDescription>Allow users to authenticate using passkeys.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          className={"text-muted-foreground"}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                          disabled={true}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="auth_methods.built_in.otp">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.built_in.otp"}>
                    {(field) => (
                      <>
                        <FieldContent className={"text-muted-foreground"}>
                          <FieldTitle>One-Time Password (OTP)</FieldTitle>
                          <FieldDescription>
                            Users will need to use one-time passwords each time for authentication.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          className={"text-muted-foreground"}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                          disabled={true}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="auth_methods.built_in.two_fa">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.built_in.two_fa"}>
                    {(field) => (
                      <>
                        <FieldContent className={"text-muted-foreground"}>
                          <FieldTitle>Two-Factor Authentication (2FA)</FieldTitle>
                          <FieldDescription>
                            Users will need to provide additional verification each time for authentication.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          className={"text-muted-foreground"}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                          disabled={true}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
            </FieldGroup>
          </fieldset>
          <fieldset className="flex flex-col space-y-4 mt-5">
            <legend className="text-base leading-none">3rd-Party Methods</legend>
            <FieldGroup className="grid grid-cols-6 w-full max-w-sm">
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.github">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.github"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiGithub size={14} />
                            <span>Github</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Github accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.gitlab">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.gitlab"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiGitlab color="#fc6d27" size={14} />
                            <span>Gitlab</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Gitlab accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.bitbucket">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.bitbucket"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiBitbucket color="#0052CC" size={14} />
                            <span>Bitbucket</span>
                          </FieldTitle>
                          <FieldDescription>
                            Allow users to authenticate with their Bitbucket accounts.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.atlassian">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.atlassian"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiAtlassian color="#0052CC" size={14} />
                            <span>Atlassian</span>
                          </FieldTitle>
                          <FieldDescription>
                            Allow users to authenticate with their Atlassian accounts.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.vercel">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.vercel"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiVercel size={14} />
                            <span>Vercel</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Vercel accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.netlify">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.netlify"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiNetlify color="#00C7B7" size={14} />
                            <span>Netlify</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Netlify accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.google">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.google"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiGoogle color="#4285F4" size={14} />
                            <span>Google</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Google accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.apple">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.apple"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiApple size={14} />
                            <span>Apple</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Apple accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.slack">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.slack"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiSlack size={14} />
                            <span>Slack</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Slack accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.zoom">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.zoom"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiZoom color="#0B5CFF" size={14} />
                            <span>Zoom</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Zoom accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.notion">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.notion"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiNotion size={14} />
                            <span>Notion</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Notion accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.linkedin">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.linkedin"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiLinkedin color="#0A66C2" size={14} />
                            <span>Linkedin</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Linkedin accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.clickup">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.click_up"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiClickup color="#7B68EE" size={14} />
                            <span>ClickUp</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their ClickUp accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.yandex">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.yandex_cloud"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiYandexcloud color="#5282FF" size={14} />
                            <span>Yandex Cloud</span>
                          </FieldTitle>
                          <FieldDescription>
                            Allow users to authenticate with their Yandex Cloud accounts.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.maildotru">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.maildotru"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiMaildotru color="#005FF9" size={14} />
                            <span>Mail.Ru</span>
                          </FieldTitle>
                          <FieldDescription>Allow users to authenticate with their Mail.Ru accounts.</FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
              <FieldLabel className="col-span-3" htmlFor="auth_methods.third_party.huggingface">
                <Field orientation="horizontal">
                  <form.Field name={"auth_methods.third_party.hugging_face"}>
                    {(field) => (
                      <>
                        <FieldContent>
                          <FieldTitle className="flex gap-1 items-center">
                            <SiHuggingface color="#FFD21E" size={14} />
                            <span>Hugging Face</span>
                          </FieldTitle>
                          <FieldDescription>
                            Allow users to authenticate with their Hugging Face accounts.
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked)}
                        />
                      </>
                    )}
                  </form.Field>
                </Field>
              </FieldLabel>
            </FieldGroup>
          </fieldset>
        </div>
        <div className="flex flex-col gap-y-5">
          <h4 className="text-lg font-base font-sans leading-none">Users & Groups</h4>
          <p className="text-xs text-muted-foreground">Manage settings for users and groups.</p>
          <Field orientation="horizontal" className="max-w-sm">
            <form.Field name="open_registration">
              {(field) => (
                <div className="flex items-center gap-5">
                  <FieldContent>
                    <FieldLabel htmlFor="open_registration">New Registrations</FieldLabel>
                    <FieldDescription>
                      Allow users to register with built-in or third-party authentication methods.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="open_registration"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </Field>
          <Field orientation="horizontal" className="max-w-sm">
            <form.Field name="email_verification">
              {(field) => (
                <div className="flex items-center gap-5">
                  <FieldContent>
                    <FieldLabel htmlFor="email_verification">Email Verification</FieldLabel>
                    <FieldDescription>
                      Require users to verify their email address before they can access the application.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="egistration_mode"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="default_perm_group">Default Permission Group</FieldLabel>
            <form.Field name="default_perm_group">
              {(field) => (
                <Select
                  name={field.name}
                  value={field.state.value}
                  defaultValue={"viewer"}
                  onValueChange={(value) => field.handleChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"viewer"}>Viewer</SelectItem>
                      {permGroups
                        .filter((pg) => pg.slug !== "viewer")
                        .map((group) => (
                          <SelectItem key={`pg-${group.slug}`} value={group.slug}>
                            {group.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="profile_img_provider">Profile Image Provider</FieldLabel>
            <form.Field name="profile_img_provider">
              {(field) => (
                <Select
                  name={field.name}
                  value={field.state.value}
                  defaultValue={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"no-default"}>No Default</SelectItem>
                      <SelectItem value={"monogram"}>Monogram</SelectItem>
                      <SelectItem value={"gravatar"}>Gravatar</SelectItem>
                      <SelectItem value={"dicebear"}>DiceBear</SelectItem>
                      <SelectItem value={"robohash"}>RoboHash</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
            <span className="text-xs text-primary py-2">
              [<span className="bg-primary text-white font-semibold text-xs px-1">No Default:</span> Provider will be
              asked in the user creation form.]
            </span>
          </Field>
        </div>
        {/* @ts-ignore */}
        <FormSubmitResetBtn form={form} />
      </form>
    </div>
  )
}
export default IdentitySettingsForm
