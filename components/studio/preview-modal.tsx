"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Eye, Info } from "lucide-react"
import { Entry } from "@/interfaces/entry"
import { EntryType } from "@/interfaces/entry_type"
import { cn } from "@/lib/utils"
import { PermissionGuard } from "@/components/studio/permission-groups/permission-guard"

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
  type: "entry" | "entry-type"
}

export function PreviewModal({ open, onOpenChange, data, type }: PreviewModalProps) {
  if (!data) return null

  const title = data.name || data.slug || "Item"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            Preview: {title}
          </DialogTitle>
          <DialogDescription>Viewing {type === "entry" ? "entry" : "entry type"} details.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4 pr-4">
          {type === "entry" ? (
            <PermissionGuard showMsg={true} reqPermission={["system.entries.read", `${data.namespace}.read-entry`]}>
              <EntryPreview data={data} />
            </PermissionGuard>
          ) : (
            <PermissionGuard showMsg={true} reqPermission={["system.entry_types.read", `${data.namespace}.read`]}>
              <EntryTypePreview data={data} />
            </PermissionGuard>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EntryPreview({ data }: { data: Entry }) {
  // Assuming 'data' property contains the entry values mapped by row/fieldset ID
  const entryData = (data as any).data || {}

  return (
    <div className="space-y-6 pb-4">
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <div>
          <Label className="text-muted-foreground">Name</Label>
          <p className="font-medium">{data.name}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Status</Label>
          <p className="font-medium">{data.status}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Entry Data</h4>
        {Object.entries(entryData).length > 0 ? (
          Object.entries(entryData).map(([rowId, fields]: [string, any]) => (
            <div key={rowId} className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <p className="text-xs font-bold text-muted-foreground italic">Row: {rowId}</p>
              <div className="grid gap-4">
                {Object.entries(fields).map(([fieldName, value]: [string, any]) => (
                  <div key={fieldName} className="space-y-1">
                    <Label className="capitalize">{fieldName.replace(/_/g, " ")}</Label>
                    <div className="p-2 rounded border bg-background text-sm min-h-[36px]">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value || "—")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No data available for this entry.</p>
        )}
      </div>
    </div>
  )
}

function EntryTypePreview({ data }: { data: EntryType }) {
  return (
    <div className="space-y-6 pb-4">
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <div>
          <Label className="text-muted-foreground">Namespace</Label>
          <p className="font-medium">{data.namespace}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Status</Label>
          <p className="font-medium">{data.status}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fieldsets & Structure</h4>
        <div className="flex flex-col gap-4">
          {data.fieldsets?.map((fieldset: any) => (
            <div key={fieldset.instanceId} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground px-1">
                {fieldset.name} ({fieldset.slug})
              </span>
              <div className="flex flex-col gap-4 p-4 border-2 border-dashed rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex flex-col gap-4">{renderFieldsStructured(fieldset.fields)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function renderFieldsStructured(fields: any[]) {
  // Mimic the grouping logic from DropZoneRow/FormRenderer
  const groupedFields = fields.reduce((acc: any[], field: any, index: number) => {
    const prevField = index > 0 ? fields[index - 1] : null
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

  return groupedFields.map((group, groupIndex) => (
    <div key={groupIndex} className={cn("flex w-full gap-4", Array.isArray(group) ? "flex-row" : "flex-col")}>
      {Array.isArray(group) ? (
        group.map((field) => <FieldDetailCard key={field.instanceId} field={field} />)
      ) : (
        <FieldDetailCard field={group} />
      )}
    </div>
  ))
}

function FieldDetailCard({ field }: { field: any }) {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger asChild>
        <Card className="p-4 flex items-center justify-between bg-card hover:bg-accent/50 cursor-pointer transition-colors group">
          <div className="flex flex-col items-start">
            <span className="text-xs font-mono uppercase text-muted-foreground">{field.type}</span>
            <span className="font-medium text-sm">{field.label || field.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 border-x border-b rounded-b-lg bg-muted/20 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-semibold">Technical Name:</span>
            <span>{field.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-semibold">Required:</span>
            <span>{field.required ? "Yes" : "No"}</span>
          </div>
          {field.placeholder && (
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-muted-foreground font-semibold">Placeholder:</span>
              <span>{field.placeholder}</span>
            </div>
          )}
          {field.options && field.options.length > 0 && (
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-muted-foreground font-semibold">Options:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {field.options.map((opt: string, i: number) => (
                  <span key={i} className="px-1.5 py-0.5 bg-background border rounded">
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(field.validation.minLength || field.validation.maxLength || field.validation.pattern) && (
            <div className="flex flex-col gap-1 col-span-2 pt-1 border-t mt-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Info className="h-3 w-3" /> Validation
              </span>
              <div className="grid grid-cols-2 gap-x-4">
                {field.validation.minLength && <span>Min: {field.validation.minLength}</span>}
                {field.validation.maxLength && <span>Max: {field.validation.maxLength}</span>}
                {field.validation.pattern && (
                  <span className="col-span-2 truncate">
                    Pattern: <code>{field.validation.pattern}</code>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
