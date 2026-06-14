//Constants
import { z } from "zod"
import { CrudAction } from "@/interfaces"

export const MAX_FILE_SIZE = 1024 * 1024 * 5
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export const MAX_PROFILE_IMG_WIDTH = 500
export const MAX_PROFILE_IMG_HEIGHT = 500

export const TEMP_PERM_GROUPS = ["admin", "editor", "viewer"] // It will be replaced with the actual permission groups from the database(prisma)

// Enum for CRUD actions
export const CrudActionSchema = z.enum(CrudAction)

export const SUPPORTED_AVATAR_DOMAINS = [
  "monogram",
  "gravatar.com",
  "secure.gravatar.com",
  "api.dicebear.com",
  "robohash.org"
  // Add more domains as needed
]

export const SUPPORTED_AVATAR_PROVIDERS = ["no-default", "monogram", "gravatar", "dicebear", "robohash"]

export const AVATAR_PATH_PATTERNS = [
  /\/avatar\/[0-9a-f]{32}(\?.*)?$/i, // Gravatar MD5 hash
  /\/[a-z-]+\/[a-z0-9-]+(\.svg|\.png|\.jpg|\.jpeg|\.webp)?(\?.*)?$/i, // Dicebear style/seed
  /\/[^/?#]+(\?.*)?$/i // Robohash
]

export const SYSTEM_FEATURES = ["Entry Types", "Entries", "Users", "Permission Groups", "Settings"] as const
