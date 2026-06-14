"use client"

import { useForm } from "@tanstack/react-form"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { MessageSquareWarning, Plus, Trash2 } from "lucide-react"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { Switch } from "@/components/ui/switch"
import { ApiKeySchema, ApiSettingsSchema } from "@/lib/schemas/server/server-schemas"
import { ApiKeyFormSchema, ApiSettingsFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { toast } from "sonner"
import updateApiSettings from "@/lib/actions/studio/settings/update-api-settings"
import { useEffect, useState } from "react"
import generateApiKey from "@/lib/actions/studio/settings/generate-api-key"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import getPermissionGroups from "@/lib/actions/studio/permission-groups/get-permission-groups"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import deleteApiKey from "@/lib/actions/studio/settings/delete-api-key"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import InfoTooltip from "@/components/studio/info-tooltip"

const ApiSettingsForm = ({
  formValues,
  apiKeys
}: {
  formValues: z.infer<typeof ApiSettingsSchema>
  apiKeys: z.infer<typeof ApiKeySchema>[]
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [permGroups, setPermGroups] = useState<{ name: string; slug: string }[]>([])

  const { id, settings } = formValues

  const form = useForm({
    defaultValues: settings,
    validators: {
      onMount: ApiSettingsFormSchema,
      onChange: ApiSettingsFormSchema,
      onSubmit: ApiSettingsFormSchema
    },
    onSubmit: async ({ value }) => {
      try {
        let response = await updateApiSettings(value, id?.toString() || "")
        if (response.success) {
          toast.success("Successful!", {
            description: `API Settings has been updated successfully!`,
            position: "top-center",
            className: "bg-emerald-500 text-white"
          })
        } else {
          toast.error(`Failed to update api settings. Please try again.`, {
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

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getPermissionGroups()
      if (res.success) setPermGroups(res.data)
    }
    fetchGroups()
  }, [])

  const generateKeyForm = useForm({
    defaultValues: {
      description: "A New Key",
      permission_group: "viewer",
      rate_limits: {
        time_window: 1,
        req_per_window: 10,
        time_interval: 100
      }
    },
    validators: {
      onChange: ApiKeyFormSchema,
      onSubmit: ApiKeyFormSchema
    },
    onSubmit: async ({ value }) => {
      const response = await generateApiKey(value)
      if (response.success) {
        toast.success("Successful!", {
          description: `API Key has been generated successfully!`,
          position: "top-center",
          className: "bg-emerald-500 text-white"
        })
      } else {
        toast.error(`Failed to generate api key. Please try again.`, {
          position: "top-center"
        })
      }
    }
  })

  const handleDeleteKey = async (id: string) => {
    const response = await deleteApiKey(id)
    if (response.success) {
      toast.success("Deleted!", {
        description: "API Key has been deleted successfully.",
        position: "top-center",
        className: "bg-emerald-500 text-white"
      })
    } else {
      toast.error("Failed to delete API key. Please try again.", {
        position: "top-center"
      })
    }
  }

  return (
    <div className="flex mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-y-10">
        <fieldset className="flex flex-col gap-y-2">
          <legend className="flex items-center gap-x-2 text-lg leading-none font-base font-sans">
            <span>Services</span>
            <InfoTooltip
              icon={<MessageSquareWarning size={14} />}
              message={"Some options of this feature still under development"}
              animate={true}
            />
          </legend>
          <span className="text-xs text-muted-foreground mt-1 mb-2">Manage REST and GrapQL API services.</span>
          <Field orientation="horizontal" className="max-w-sm">
            <form.Field name="service_rest_api">
              {(field: any) => (
                <div className="flex items-center gap-5">
                  <FieldContent>
                    <FieldLabel htmlFor="service_rest_api">REST API</FieldLabel>
                    <FieldDescription>Enables REST API service.</FieldDescription>
                  </FieldContent>
                  <Switch
                    id="egistration_mode"
                    defaultChecked
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </Field>
          <Field orientation="horizontal" className="max-w-sm">
            <form.Field name="service_graphql">
              {(field: any) => (
                <div className="flex items-center gap-5">
                  <FieldContent>
                    <FieldLabel htmlFor="service_graphql">GraphQL</FieldLabel>
                    <FieldDescription>Enables GraphQL service.</FieldDescription>
                  </FieldContent>
                  <Switch
                    id="egistration_mode"
                    checked={field.state.value}
                    disabled
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                </div>
              )}
            </form.Field>
          </Field>
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <legend className="text-lg leading-none font-base font-sans">Rate Limiting</legend>
          <span className="text-xs text-muted-foreground mt-1 mb-2">Manage limits of API requests.</span>
          <Field>
            <FieldLabel htmlFor="rate_limits.time_window">API Limit Time Window</FieldLabel>
            <FieldDescription>Time window in minutes for API request limit</FieldDescription>
            <form.Field name="rate_limits.time_window">
              {(field: any) => (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="number"
                  minLength={1}
                  className="bg-input"
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  aria-label={"Time Window Rate Limit"}
                />
              )}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="rate_limits.req_per_window">Number of Request per Time Window</FieldLabel>
            <FieldDescription>Number of requests allowed per time window</FieldDescription>
            <form.Field name="rate_limits.req_per_window">
              {(field: any) => (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="number"
                  minLength={1}
                  className="bg-input"
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  aria-label={"Number of Request per Time Window Rate Limit"}
                />
              )}
            </form.Field>
          </Field>
          <Field>
            <FieldLabel htmlFor="rate_limits.time_interval">Time Interval per Request</FieldLabel>
            <FieldDescription>Time interval in milliseconds between each request</FieldDescription>
            <form.Field name="rate_limits.time_interval">
              {(field: any) => (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="number"
                  minLength={1}
                  className="bg-input"
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  aria-label={"Time Interval per Request Rate Limit"}
                />
              )}
            </form.Field>
          </Field>
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <legend className="text-lg leading-none font-base font-sans">API Keys</legend>
              <span className="text-xs text-muted-foreground mt-1 mb-2">Manage API keys for your application.</span>
            </div>
            {/* API Key Form*/}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-150"
                  size="sm">
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    generateKeyForm.handleSubmit()
                  }}
                  className="space-y-4">
                  <generateKeyForm.Field name="description">
                    {(field: any) => (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. Production Key"
                          aria-label={"API Key Description"}
                        />
                      </Field>
                    )}
                  </generateKeyForm.Field>

                  <generateKeyForm.Field name="permission_group">
                    {(field: any) => (
                      <Field>
                        <FieldLabel>Permission Group</FieldLabel>
                        <Select onValueChange={field.handleChange} value={field.state.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                          <SelectContent>
                            {permGroups.map((group) => (
                              <SelectItem key={group.slug} value={group.slug}>
                                {group.name}
                              </SelectItem>
                            ))}
                            <SelectItem key={"viewer"} value={"viewer"}>
                              Viewer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </generateKeyForm.Field>

                  <div className="grid grid-cols-3 gap-2">
                    <generateKeyForm.Field name="rate_limits.time_window">
                      {(field: any) => (
                        <Field>
                          <FieldLabel>Window (min)</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                            aria-label={"Rate Limit Time Window"}
                          />
                        </Field>
                      )}
                    </generateKeyForm.Field>
                    <generateKeyForm.Field name="rate_limits.req_per_window">
                      {(field: any) => (
                        <Field>
                          <FieldLabel>Requests</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                            aria-label={"Requests per Time Window Rate Limit"}
                          />
                        </Field>
                      )}
                    </generateKeyForm.Field>
                    <generateKeyForm.Field name="rate_limits.time_interval">
                      {(field: any) => (
                        <Field>
                          <FieldLabel>Interval (ms)</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                            aria-label={"Time Interval per Request Rate Limit"}
                          />
                        </Field>
                      )}
                    </generateKeyForm.Field>
                  </div>

                  <DialogFooter>
                    <FormSubmitResetBtn form={generateKeyForm} />
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div id="api-keys" className="flex w-full max-w-md flex-col gap-6">
            {apiKeys.map((apiKey) => (
              <Item key={`apikey-${apiKey._id}`} variant="outline">
                <ItemContent>
                  <ItemTitle>
                    <b>Key:</b> {apiKey.key}
                  </ItemTitle>
                  <ItemDescription className="flex flex-col gap-y-1">
                    <span>
                      <b>Permission Group:</b> {apiKey.permission_group || "No Data"}
                    </span>
                    <span>
                      <b>Description</b>: {apiKey.description || "No Data"}
                    </span>
                    {apiKey.rate_limits && (
                      <span className="flex flex-col gap-y-1">
                        <b>Rate Limits:</b>
                        <span className="flex flex-col gap-y-1 px-2">
                          <span>&bull; Time Window: {apiKey.rate_limits.time_window} minute(s)</span>
                          <span>&bull; Requests per Window: {apiKey.rate_limits.req_per_window}</span>
                          <span>&bull; Time Interval: {apiKey.rate_limits.time_interval} ms</span>
                        </span>
                      </span>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your API key.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteKey(apiKey._id.toString())}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ItemActions>
              </Item>
            ))}
          </div>
        </fieldset>
        {/* @ts-ignore */}
        <FormSubmitResetBtn form={form} />
      </form>
    </div>
  )
}
export default ApiSettingsForm
