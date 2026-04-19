import { z } from "zod"
import {
  EntryTypeFieldSchema,
  EntryTypeFieldsetSchema,
  EntryTypeFieldValidationSchema,
  EntryTypeSchema
} from "@/lib/schemas"

export type EntryType = z.infer<typeof EntryTypeSchema>
export type Field = z.infer<typeof EntryTypeFieldSchema>
export type FieldValidation = z.infer<typeof EntryTypeFieldValidationSchema>
export type FieldSet = z.infer<typeof EntryTypeFieldsetSchema>
