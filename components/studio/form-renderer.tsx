"use client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, RendererField } from "@/interfaces/entry_type"
import FieldErrorText from "@/components/studio/field-error-text"
import fieldSchemaBuilder from "@/lib/schemas/client/field-schema-builder"
import { useFormContext } from "@/app/studio/entries/form"

type Props = {
  rows: any[]
  context?: typeof useFormContext
}

export const FormRenderer = ({ rows, context }: Props) => {
  let form: any = undefined
  if (context) form = context()

  const renderField = (field: RendererField) => {
    let defaultOption: string | undefined = undefined
    if (!form) {
      switch (field.type) {
        case "Text Input":
          return <Input name={field.name} placeholder={field.placeholder || "Enter text..."} />
        case "Textarea":
          return <Textarea name={field.name} placeholder={field.placeholder || "Enter text..."} />
        case "Checkbox":
          return (
            <div className="flex items-center gap-x-2">
              <Checkbox name={field.name} id={field.instanceId} />
              <Label htmlFor={field.instanceId}>{field.label}</Label>
            </div>
          )
        case "Radio Group":
          return (
            <RadioGroup name={field.name} defaultValue={defaultOption}>
              {field.options.map((option: string) => {
                defaultOption = option
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field.instanceId}-${option}`} />
                    <Label htmlFor={`${field.instanceId}-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          )
        case "Select":
          return (
            <Select name={field.name}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => {
                  return (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        default:
          return null
      }
    }

    // Controlled mode: register with TanStack Form using a per-field Zod validator
    // built from the entry type's validation rules.
    const fieldSchema = fieldSchemaBuilder(field)
    const fieldName = `data.${rows.find((row) => row.fields.find((val: Field) => val.instanceId === field.instanceId)).instanceId}.${field.name}`

    return (
      <form.Field
        validators={{
          onBlur: ({ value }: { value: any }) => {
            const r = fieldSchema.safeParse(value)
            return r.success ? undefined : r.error.issues[0]?.message
          },
          onChangeAsyncDebounceMs: 1500,
          onChangeAsync: async ({ value }: { value: any }) => {
            const r = await fieldSchema.safeParseAsync(value)
            return r.success ? undefined : r.error.issues[0]?.message
          }
        }}
        name={fieldName}>
        {(f: any) => {
          switch (field.type) {
            case "Text Input":
              return (
                <>
                  <Input
                    id={field.instanceId}
                    name={f.name}
                    placeholder={field.placeholder || "Enter text..."}
                    value={f.state.value || ""}
                    required={field.required}
                    onBlur={f.handleBlur}
                    onChange={(e) => f.handleChange(e.target.value as any)}
                    aria-invalid={f.state.meta.errors.length > 0}
                  />
                  <FieldErrorText field={f as any} />
                </>
              )
            case "Textarea":
              return (
                <>
                  <Textarea
                    id={field.instanceId}
                    name={f.name}
                    placeholder={field.placeholder || "Enter text..."}
                    value={f.state.value as any}
                    onBlur={f.handleBlur}
                    onChange={(e) => f.handleChange(e.target.value as any)}
                    aria-invalid={f.state.meta.errors.length > 0}
                  />
                  <FieldErrorText field={f as any} />
                </>
              )
            case "Checkbox":
              return (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.instanceId}
                      checked={Boolean(f.state.value)}
                      onCheckedChange={(checked) => f.handleChange(Boolean(checked) as any)}
                      onBlur={f.handleBlur}
                    />
                    <Label htmlFor={field.instanceId}>{field.label}</Label>
                  </div>
                  <FieldErrorText field={f as any} />
                </>
              )
            case "Radio Group":
              return (
                <>
                  <RadioGroup
                    value={(f.state.value as string) ?? ""}
                    onValueChange={(val) => f.handleChange(val as any)}>
                    {field.options?.map((option: string) => {
                      const id = `${field.instanceId}-${option}`
                      return (
                        <div key={id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={id} />
                          <Label htmlFor={id}>{option.charAt(0).toUpperCase() + option.slice(1)}</Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                  <FieldErrorText field={f as any} />
                </>
              )
            case "Select":
              return (
                <>
                  <Select value={(f.state.value as string) ?? ""} onValueChange={(val) => f.handleChange(val as any)}>
                    <SelectTrigger onBlur={f.handleBlur}>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option: any) => {
                        return (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FieldErrorText field={f as any} />
                </>
              )
            default:
              return null
          }
        }}
      </form.Field>
    )
  }

  return (
    <div className="p-8 border rounded-xl bg-background space-y-6">
      {rows.map((row) => (
        <fieldset key={row.instanceId} className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          {row.name && <legend className="text-lg font-semibold">{row.name}</legend>}
          <div className="flex flex-col gap-4">
            {row.fields
              .reduce((acc: any[], field: any, index: number) => {
                const prevField = index > 0 ? row.fields[index - 1] : null
                const isCombinedWithPrevious = prevField && prevField.nextFieldId === field.instanceId
                if (isCombinedWithPrevious) {
                  const last = acc[acc.length - 1]
                  if (Array.isArray(last)) last.push(field)
                  else acc[acc.length - 1] = [last, field]
                } else {
                  acc.push(field)
                }
                return acc
              }, [])
              .map((fieldGroup: RendererField | RendererField[], groupIndex: number) => (
                <div
                  key={groupIndex}
                  className={`flex ${Array.isArray(fieldGroup) ? "flex-row gap-4" : "flex-col"} w-full`}>
                  {Array.isArray(fieldGroup) ? (
                    fieldGroup.map((field) => (
                      <div key={field.instanceId} className="flex flex-col w-full gap-2 space-y-2">
                        <Label className="flex capitalize gap-1 px-0.5">
                          <span>
                            {field.label
                              ? field.label
                              : field.type.split(" ").join("_").toLowerCase() !== field.name
                                ? field.label
                                : field.type}
                          </span>
                          <span>{field.required && "*"}</span>
                        </Label>
                        {renderField(field)}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col w-full gap-2 space-y-2">
                      <Label className="flex capitalize gap-1 px-0.5">
                        <span>
                          {fieldGroup.label
                            ? fieldGroup.label
                            : fieldGroup.type.split(" ").join("_").toLowerCase() !== fieldGroup.name
                              ? fieldGroup.label
                              : fieldGroup.type}
                        </span>
                        <span>{fieldGroup.required && "*"}</span>
                      </Label>
                      {renderField(fieldGroup)}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
