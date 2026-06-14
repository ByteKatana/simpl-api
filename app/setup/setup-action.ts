"use server"

import { exec } from "child_process"
import { promisify } from "util"
import { SetupFormValues, UserStatus } from "@/interfaces"
import { uid } from "uid"
import { apiKeyController } from "@/controllers/api-key.controller"
import { UserController } from "@/controllers/user.controller"
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { connectDB } from "@/lib/mongodb"
import handleError from "@/lib/handlers/error"

const execAsync = promisify(exec)

export async function runSetupAction(values: SetupFormValues) {
  try {
    const client = await connectDB()
    const dbConnection = client.db()

    // Creating required collections
    await dbConnection.createCollection("api_keys")
    await dbConnection.createCollection("entries")
    await dbConnection.createCollection("entry_types")
    await dbConnection.createCollection("permission_groups")
    const userRes = await dbConnection.createCollection("users")

    // Creating Admin Account
    const adminEmail = values.ADMIN_EMAIL
    const UserData = new UserController(
      {
        fullname: values.ADMIN_FULLNAME,
        username: values.ADMIN_USERNAME,
        password: values.ADMIN_PASSWORD,
        email: adminEmail,
        email_verified: true,
        permission_group: "root",
        profile_img: "",
        status: UserStatus.Active
      },
      false
    )
    const accountResult = await UserData.create()
    if (accountResult.status !== "success") return handleError(new Error("Admin creation failed"))

    // Creating Permission Groups
    const privileges = [
      { "system.entry_types": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.entries": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.users": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.permission_groups": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.settings": { permissions: ["list", "read", "update", "delete", "create"] } }
    ]

    const rootGroup = new PermissionGroupController({ name: "root", slug: "root", privileges }, false)
    const adminGroup = new PermissionGroupController({ name: "admin", slug: "admin", privileges }, false)
    const viewerGroup = new PermissionGroupController({ name: "Viewer", slug: "viewer", privileges: [] }, false)

    const rootResult = await rootGroup.create()
    const adminResult = await adminGroup.create()
    const viewerResult = await viewerGroup.create()

    if (rootResult.status !== "success" || adminResult.status !== "success" || viewerResult.status !== "success") {
      return handleError(new Error("Permission groups creation failed"))
    }

    // 3. Generate API Key Directly
    const generatedKey = uid(32)
    const apiKeyData = new apiKeyController({
      key: generatedKey,
      description: "SYSTEM",
      permission_group: "root",
      created_at: new Date().toISOString()
    })
    const keyResult = await apiKeyData.create()

    if (keyResult.status !== "success") {
      return handleError(new Error("Failed to generate API key"))
    }

    // 5. Run Prisma commands
    await execAsync("npx prisma db push")
    await execAsync("npx prisma db seed")

    return {
      success: true,
      adminAccount: { username: values.ADMIN_USERNAME, email: adminEmail, password: values.ADMIN_PASSWORD },
      apiKey: generatedKey
    }
  } catch (error: any) {
    console.error("SETUP_ACTION_ERROR:", error)
    // Return "Something went wrong" message for any error thrown during setup
    return { success: false, error: "Something went wrong" }
  }
}
