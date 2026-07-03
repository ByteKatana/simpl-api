import z from "zod"
import { RendererField } from "@/interfaces/entry_type"

const fieldSchemaBuilder = (field: RendererField): z.ZodTypeAny => {
  const label = field.label || field.type

  switch (field.type) {
    case "Checkbox": {
      let s: z.ZodTypeAny = z.boolean({ error: `${label} must be a boolean` })
      if (field.validation.required) {
        s = s.refine((v) => v === true, { message: `${label} is required` })
      } else {
        s = s.optional()
      }
      return s
    }
    case "Select":
    case "Radio Group": {
      let s: z.ZodString = z.string()
      if (field.validation.required) s = s.min(1, { message: `${label} is required` })
      return field.validation.required ? s : s.optional()
    }
    default: {
      let s: z.ZodString = z.string()
      if (field.validation.required) s = s.min(1, { message: `${label} is required` })
      if (typeof field.validation.minLength === "number" && field.validation.minLength > 0) {
        s = s.min(field.validation.minLength, {
          message: `${label} must be at least ${field.validation.minLength} characters`
        })
      }
      if (typeof field.validation.maxLength === "number" && field.validation.maxLength > 0) {
        s = s.max(field.validation.maxLength, {
          message: `${label} must be at most ${field.validation.maxLength} characters`
        })
      }
      if (field.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern)
          s = s.regex(regex, { message: `${label} format is invalid` })
        } catch (e: unknown) {
          /* invalid regex - skip */
        }
      }
      return field.validation.required ? s : s.optional().or(z.literal(""))
    }
  }
}

export default fieldSchemaBuilder
