import { z } from "zod"
import {
  EntryTypeFieldFormSchema,
  EntryTypeFieldSchema,
  EntryTypeFieldsetSchema,
  EntryTypeFieldValidationSchema,
  EntryTypeSchema
} from "@/lib/schemas/server/server-schemas"

export type EntryType = z.infer<typeof EntryTypeSchema>
export type Field = z.infer<typeof EntryTypeFieldSchema>
export type FieldValidation = z.infer<typeof EntryTypeFieldValidationSchema>
export type FieldSet = z.infer<typeof EntryTypeFieldsetSchema>

// Form Types
export type formField = z.infer<typeof EntryTypeFieldFormSchema>
export type RendererField = Partial<z.infer<typeof EntryTypeFieldFormSchema>> & {
  instanceId: string
  type: string
  name?: string
  label?: string
  placeholder?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  options?: any[]
  nextFieldId?: string
}
