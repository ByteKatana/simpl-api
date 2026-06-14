"use client"
import { useEffect, useRef, useState } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentListBar, FORM_COMPONENTS } from "@/components/studio/entry-types/component-list-bar"
import { DropZoneRow } from "@/components/studio/entry-types/drop-zone-row"
import { FormRenderer } from "@/components/studio/form-renderer"
import { EntryTypeFieldFormSchema, EntryTypeFieldsetFormSchema } from "@/lib/schemas/client/form-schemas"
import { z } from "zod"
import { PlusCircle, Pencil } from "lucide-react"

// EntryType Field and Row Types
type FieldItem = z.infer<typeof EntryTypeFieldFormSchema>
type RowItem = z.infer<typeof EntryTypeFieldsetFormSchema>

type FieldFormValues = FieldItem

interface CanvasState {
  rows: RowItem[]
}

const defaultFieldValues = (): FieldFormValues => ({
  instanceId: "",
  type: "",
  name: "",
  label: "",
  placeholder: "",
  options: [],
  required: false,
  minLength: 1,
  maxLength: 2,
  pattern: ""
})

const defaultCanvasState = (): CanvasState => ({
  rows: []
})

export const BuilderCanvas = ({
  value: parentFormState,
  onChange: parentOnChange
}: {
  value: any
  onChange: (val: any) => void
}) => {
  const [rows, setRows] = useState<RowItem[]>(parentFormState || defaultCanvasState().rows)

  const canvasForm = useForm({
    defaultValues: { rows: parentFormState || defaultCanvasState().rows }
  })

  // Sync internal state when parent form changes its value
  useEffect(() => {
    if (parentFormState !== rows) {
      setRows(parentFormState || [])
      canvasForm.setFieldValue("rows", parentFormState || [])
    }
  }, [parentFormState])

  // Sync parent form when internal state changes
  useEffect(() => {
    canvasForm.setFieldValue("rows", rows)
    parentOnChange(rows)
  }, [rows])

  const [editingField, setEditingField] = useState<{ rowId: string; instanceId: string } | null>(null)
  const [optionInput, setOptionInput] = useState("")
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editingRowName, setEditingRowName] = useState("")
  const savedFieldSnapshot = useRef<FieldItem | null>(null)

  const editForm = useForm({
    defaultValues: defaultFieldValues(),
    validators: {
      onChange: ({ value }) => {
        const result = EntryTypeFieldFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues[0]?.message ?? "Invalid"
        }
        return undefined
      }
    }
  })

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        instanceId: `row-${Date.now()}`,
        name: `Row ${prev.length + 1}`,
        slug: `row_${prev.length + 1}`,
        fields: []
      }
    ])
  }

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.instanceId !== rowId))
  }

  const removeField = (rowId: string, index: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.instanceId !== rowId) return row
        const fields = [...row.fields]
        fields.splice(index, 1)
        return { ...row, fields }
      })
    )
  }

  const openEdit = (rowId: string, instanceId: string) => {
    const row = rows.find((r) => r.instanceId === rowId)
    const field = row?.fields.find((f) => f.instanceId === instanceId)
    if (!field) return
    savedFieldSnapshot.current = { ...field, options: [...field.options] }
    editForm.setFieldValue("instanceId", field.instanceId)
    editForm.setFieldValue("type", field.type)
    editForm.setFieldValue("name", field.name)
    editForm.setFieldValue("label", field.label)
    editForm.setFieldValue("placeholder", field.placeholder)
    editForm.setFieldValue("options", field.options)
    editForm.setFieldValue("required", field.required)
    editForm.setFieldValue("minLength", field.minLength)
    editForm.setFieldValue("maxLength", field.maxLength)
    editForm.setFieldValue("pattern", field.pattern)
    editForm.setFieldValue("nextFieldId", field.nextFieldId)
    setEditingField({ rowId, instanceId })
  }

  const saveEdit = () => {
    if (!editingField) return
    const values = editForm.state.values
    setRows((prev): RowItem[] =>
      prev.map((row) => {
        if (row.instanceId !== editingField.rowId) return row
        return {
          ...row,
          fields: row.fields.map((f): FieldItem => {
            if (f.instanceId !== editingField.instanceId) return f
            return {
              ...values,
              name: values.name.split(" ").join("_").toLowerCase()
            }
          })
        }
      })
    )
    savedFieldSnapshot.current = null
    setEditingField(null)
    editForm.reset()
  }

  const revertEdit = () => {
    const snap = savedFieldSnapshot.current
    if (snap && editingField) {
      setRows((prev): RowItem[] =>
        prev.map((row) => {
          if (row.instanceId !== editingField.rowId) return row
          return {
            ...row,
            fields: row.fields.map((f): FieldItem => (f.instanceId === editingField.instanceId ? snap! : f))
          }
        })
      )
    }
    savedFieldSnapshot.current = null
    setEditingField(null)
    editForm.reset()
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, combine } = result

    if (!destination && !combine) return

    if (source.droppableId === "COMPONENTS") {
      const comp = FORM_COMPONENTS.find((c) => c.id === draggableId)
      if (!comp) return

      const targetRowId = destination?.droppableId ?? combine?.droppableId
      if (!targetRowId) return

      const newField: FieldItem = {
        instanceId: `field-${Date.now()}`,
        type: comp.label,
        name: comp.label.split(" ").join("_").toLowerCase(),
        label: "",
        placeholder: "",
        options: [],
        required: false,
        minLength: 1,
        maxLength: 255,
        pattern: ""
      }

      setRows((prev) =>
        prev.map((row) => {
          if (row.instanceId !== targetRowId) return row
          if (combine) {
            const fields = row.fields.map((f) =>
              f.instanceId === combine.draggableId ? { ...f, nextFieldId: newField.instanceId } : f
            )
            return { ...row, fields: [...fields, newField] }
          }
          const fields = [...row.fields]
          fields.splice(destination!.index, 0, newField)
          return { ...row, fields }
        })
      )
      return
    }

    if (combine && source.droppableId !== "COMPONENTS") {
      // combine two existing fields within a row
      //@ts-ignore
      setRows((prev) =>
        prev.map((row) => {
          if (row.instanceId !== source.droppableId) return row
          const draggedField = row.fields[source.index]
          if (!draggedField) return row
          const fields = row.fields
            .filter((_, i) => i !== source.index)
            .map((f) => (f.instanceId === combine.draggableId ? { ...f, nextFieldId: draggedField.instanceId } : f))
          return { ...row, fields: [...fields, draggedField] }
        })
      )
      return
    }

    if (destination && source.droppableId === destination.droppableId) {
      setRows((prev) =>
        prev.map((row) => {
          if (row.instanceId !== source.droppableId) return row
          const fields = [...row.fields]
          const [moved] = fields.splice(source.index, 1)
          fields.splice(destination.index, 0, moved)
          return { ...row, fields }
        })
      )
    }
  }

  const editingFieldData = editingField
    ? rows
        .find((r) => r.instanceId === editingField.rowId)
        ?.fields.find((f) => f.instanceId === editingField.instanceId)
    : null

  const showOptions = editingFieldData?.type === "Radio Group" || editingFieldData?.type === "Select"

  const editErrors = editForm.state.errors

  return (
    <div className="flex flex-col gap-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6">
          {/* Left: rows */}
          <div className="flex flex-col gap-4 flex-1">
            {rows.map((row) => (
              <div key={row.instanceId} className="flex flex-col gap-1">
                {/* Editable row name */}
                <div className="flex items-center gap-1 group/title px-1">
                  {editingRowId === row.instanceId ? (
                    <Input
                      autoFocus
                      className="h-6 text-sm font-semibold w-48 px-1 py-0"
                      value={editingRowName}
                      aria-label={"Edit row name"}
                      onChange={(e) => setEditingRowName(e.target.value)}
                      onBlur={() => {
                        const trimmed = editingRowName.trim()
                        if (trimmed) {
                          setRows((prev) =>
                            prev.map((r) =>
                              r.instanceId === row.instanceId
                                ? { ...r, name: trimmed, slug: trimmed.split(" ").join("_").toLowerCase() }
                                : r
                            )
                          )
                        }
                        setEditingRowId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const trimmed = editingRowName.trim()
                          if (trimmed) {
                            setRows((prev) =>
                              prev.map((r) =>
                                r.instanceId === row.instanceId
                                  ? { ...r, name: trimmed, slug: trimmed.split(" ").join("_").toLowerCase() }
                                  : r
                              )
                            )
                          }
                          setEditingRowId(null)
                        }
                        if (e.key === "Escape") setEditingRowId(null)
                      }}
                    />
                  ) : (
                    <span
                      className="text-sm font-semibold text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1 transition-colors"
                      onClick={() => {
                        setEditingRowId(row.instanceId)
                        setEditingRowName(row.name)
                      }}>
                      {row.name}
                      <Pencil className="w-3 h-3 opacity-0 group-hover/title:opacity-60 transition-opacity" />
                    </span>
                  )}
                </div>
                <DropZoneRow
                  rowId={row.instanceId}
                  items={row.fields}
                  onRemove={removeField}
                  onRemoveRow={removeRow}
                  onEdit={openEdit}
                />
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full border-dashed" onClick={addRow}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>

          {/* Right: component list bar */}
          <ComponentListBar />
        </div>
      </DragDropContext>

      {/* Preview tabs below DragDropContext */}
      <Tabs defaultValue="visual" className="w-full">
        <TabsList>
          <TabsTrigger value="visual">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="visual">
          <FormRenderer rows={rows} />
        </TabsContent>
        <TabsContent value="json">
          <div className="p-4 border rounded-xl bg-muted/50 overflow-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">
              {JSON.stringify({ ...rows }, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Field Sheet */}
      <Sheet
        open={!!editingField}
        onOpenChange={(open) => {
          if (!open) revertEdit()
        }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Field</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            {/* Name */}
            <editForm.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const r = EntryTypeFieldFormSchema.shape.name.safeParse(value)
                  return r.success ? undefined : r.error.issues[0]?.message
                }
              }}>
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-name">Name</Label>
                  <Input
                    id="field-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            {/* Label */}
            <editForm.Field name="label">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-label">Label</Label>
                  <Input
                    id="field-label"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            {/* Placeholder */}
            <editForm.Field name="placeholder">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-placeholder">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            {/* Options (Radio / Select only) */}
            {showOptions && (
              <editForm.Field name="options">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Options</Label>
                    <div className="flex gap-2">
                      <Input
                        value={optionInput}
                        placeholder="Add option..."
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && optionInput.trim()) {
                            e.preventDefault()
                            field.handleChange([...field.state.value, optionInput.trim()])
                            setOptionInput("")
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (optionInput.trim()) {
                            field.handleChange([...field.state.value, optionInput.trim()])
                            setOptionInput("")
                          }
                        }}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      {field.state.value.map((opt, i) => (
                        <div key={i} className="flex items-center justify-between text-sm px-2 py-1 bg-muted rounded">
                          <span>{opt}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => field.handleChange(field.state.value.filter((_, idx) => idx !== i))}>
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    {field.state.meta.errors?.length > 0 && (
                      <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                    )}
                  </div>
                )}
              </editForm.Field>
            )}

            {/* Required */}
            <editForm.Field name="required">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="field-required"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <Label htmlFor="field-required">Required</Label>
                </div>
              )}
            </editForm.Field>

            {/* Min Length */}
            <editForm.Field
              name="minLength"
              validators={{
                onChange: ({ value }) => {
                  const r = EntryTypeFieldFormSchema.shape.minLength.safeParse(value)
                  return r.success ? undefined : r.error.issues[0]?.message
                }
              }}>
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-minlength">Min Length</Label>
                  <Input
                    id="field-minlength"
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            {/* Max Length */}
            <editForm.Field
              name="maxLength"
              validators={{
                onChange: ({ value }) => {
                  const r = EntryTypeFieldFormSchema.shape.maxLength.safeParse(value)
                  return r.success ? undefined : r.error.issues[0]?.message
                }
              }}>
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-maxlength">Max Length</Label>
                  <Input
                    id="field-maxlength"
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            {/* Pattern */}
            <editForm.Field
              name="pattern"
              validators={{
                onChange: ({ value }) => {
                  const r = EntryTypeFieldFormSchema.shape.pattern.safeParse(value)
                  return r.success ? undefined : r.error.issues[0]?.message
                }
              }}>
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="field-pattern">Pattern (regex)</Label>
                  <Input
                    id="field-pattern"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  )}
                </div>
              )}
            </editForm.Field>

            <Button type="button" onClick={saveEdit} disabled={editErrors.length > 0} className="mt-2">
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
