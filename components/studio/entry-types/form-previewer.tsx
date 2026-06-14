import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import z from "zod"
import { EntryTypeFieldFormSchema } from "@/lib/schemas/client/form-schemas"

export const FormRenderer = ({ rows }: { rows: any[] }) => {
  const renderField = (field: any) => {
    switch (field.type) {
      case "Text Input":
        return <Input placeholder={field.placeholder || "Enter text..."} />
      case "Textarea":
        return <Textarea placeholder={field.placeholder || "Enter text..."} />
      case "Checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.instanceId} />
            <Label htmlFor={field.instanceId}>{field.label}</Label>
          </div>
        )
      case "Radio Group":
        return (
          <RadioGroup defaultValue="option-one">
            {field.options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.text} id="o1" />
                <Label htmlFor="o1">{option.text.charAt(0).toUpperCase() + option.text.slice(1)}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "Select":
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-8 border rounded-xl bg-background space-y-6">
      <h2 className="text-2xl font-bold mb-4">Entry Type Name</h2>
      {rows.map((row) => (
        <fieldset key={row.instanceId} className="flex flex-col gap-y-7 border-2 border-gray-200 p-4 rounded-md">
          {row.name && <legend className="text-lg font-semibold">{row.name}</legend>}
          <div className="flex flex-col gap-4">
            {/*// TODO: Improve code quality here between line 63-106*/}
            {row.fields
              .reduce((acc: any[], field: any, index: number) => {
                const prevField = index > 0 ? row.fields[index - 1] : null
                const isCombinedWithPrevious = prevField && prevField.nextFieldId === field.instanceId

                if (isCombinedWithPrevious) {
                  const last = acc[acc.length - 1]
                  if (Array.isArray(last)) {
                    last.push(field)
                  } else {
                    acc[acc.length - 1] = [last, field]
                  }
                } else {
                  acc.push(field)
                }
                return acc
              }, [])
              .map(
                (
                  fieldGroup: z.infer<typeof EntryTypeFieldFormSchema> & { instanceId: string; type: string },
                  groupIndex: number
                ) => (
                  <div
                    key={groupIndex}
                    className={`flex ${Array.isArray(fieldGroup) ? "flex-row gap-4" : "flex-col"} w-full`}>
                    {Array.isArray(fieldGroup) ? (
                      fieldGroup.map((field) => (
                        <div key={field.instanceId} className="flex flex-col w-full gap-2 space-y-2">
                          <Label className="flex capitalize gap-1 px-0.5">
                            <span>{field.name || field.type}</span>
                            <span>{field.required && "*"}</span>
                          </Label>
                          {field.label && (
                            <Label className="flex capitalize gap-1 px-0.5 text-muted">{field.label}</Label>
                          )}
                          {renderField(field)}
                        </div>
                      ))
                    ) : (
                      <div key={fieldGroup.instanceId} className="flex flex-col w-full gap-2 space-y-2">
                        <Label className="flex capitalize gap-1 px-0.5">
                          <span>{fieldGroup.name || fieldGroup.type}</span>
                          <span>{fieldGroup.required && "*"}</span>
                        </Label>
                        {fieldGroup.label && (
                          <Label className="flex capitalize gap-1 px-0.5 text-muted">{fieldGroup.label}</Label>
                        )}
                        {renderField(fieldGroup)}
                      </div>
                    )}
                  </div>
                )
              )}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
