import { z } from "zod"
import {
  GeneralSettingsSchema,
  IdentitySettingsSchema,
  ApiSettingsSchema,
  AppearanceSettingsSchema,
  SettingsSchema
} from "@/lib/schemas/server/server-schemas"

export type SettingsSchema = z.infer<typeof SettingsSchema>
export type GeneralSettings = z.infer<typeof GeneralSettingsSchema>
export type IdentitySettings = z.infer<typeof IdentitySettingsSchema>
export type ApiSettings = z.infer<typeof ApiSettingsSchema>
export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>
