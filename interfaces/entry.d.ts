import { z } from "zod"
import { EntryCreateSchema } from "@/lib/schemas/server/server-schemas"
import { EntryCreateFormSchema } from "@/lib/schemas/client/form-schemas"

export type Entry = z.infer<typeof EntryCreateSchema>
export type EntryFormValues = z.infer<typeof EntryCreateFormSchema>
