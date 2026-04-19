import { z } from "zod"
import { EntryCreateSchema } from "@/lib/schemas"

export type Entry = z.infer<typeof EntryCreateSchema>
