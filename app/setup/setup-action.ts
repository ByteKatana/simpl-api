"use server"

import { exec } from "child_process"
import { promisify } from "util"
import { DbPrivilege, SetupActionResponse, SetupFormValues, UserStatus } from "@/interfaces"
import { uid } from "uid"
import { apiKeyController } from "@/controllers/api-key.controller"
import { UserController } from "@/controllers/user.controller"
import { PermissionGroupController } from "@/controllers/permission-group.controller"
import { connectDB } from "@/lib/mongodb"
import handleError from "@/lib/handlers/error"

const execAsync = promisify(exec)

export async function runSetupAction(values: SetupFormValues): Promise<SetupActionResponse> {
  try {
    const client = await connectDB()
    const dbConnection = client.db()

    // Creating required collections
    await dbConnection.createCollection("api_keys")
    await dbConnection.createCollection("entries")
    await dbConnection.createCollection("entry_types")
    await dbConnection.createCollection("permission_groups")
    await dbConnection.createCollection("users")

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
        status: UserStatus.Active,
        created_at: new Date().toISOString(),
        created_by: "SETUP",
        updated_at: new Date().toISOString(),
        updated_by: "SETUP"
      },
      false
    )
    const accountResult = await UserData.create()
    if (Array.isArray(accountResult) || accountResult.status !== "success") {
      return handleError(new Error("Admin creation failed"), "server")
    }

    // Creating Permission Groups
    const privileges: DbPrivilege[] = [
      { "system.entry_types": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.entries": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.users": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.permission_groups": { permissions: ["list", "read", "update", "delete", "create"] } },
      { "system.settings": { permissions: ["list", "read", "update", "delete", "create"] } }
    ]

    const created_at = new Date().toISOString()
    const rootGroup = new PermissionGroupController(
      {
        name: "root",
        slug: "root",
        privileges,
        created_at,
        updated_at: created_at
      },
      false
    )
    const adminGroup = new PermissionGroupController(
      {
        name: "admin",
        slug: "admin",
        privileges,
        created_at,
        updated_at: created_at
      },
      false
    )
    const viewerGroup = new PermissionGroupController(
      {
        name: "Viewer",
        slug: "viewer",
        privileges: [],
        created_at,
        updated_at: created_at
      },
      false
    )

    const rootResult = await rootGroup.create()
    const adminResult = await adminGroup.create()
    const viewerResult = await viewerGroup.create()

    if (
      Array.isArray(rootResult) ||
      rootResult.status !== "success" ||
      Array.isArray(adminResult) ||
      adminResult.status !== "success" ||
      Array.isArray(viewerResult) ||
      viewerResult.status !== "success"
    ) {
      return handleError(new Error("Permission groups creation failed"), "server")
    }

    // Generate API Key Directly
    const generatedKey = uid(32)
    const apiKeyData = new apiKeyController({
      key: generatedKey,
      description: "SYSTEM",
      permission_group: "root",
      rate_limits: {
        time_window: 60,
        req_per_window: 1000,
        time_interval: 1000
      },
      created_at: new Date().toISOString()
    })
    const keyResult = await apiKeyData.create()

    if (!keyResult || Array.isArray(keyResult) || keyResult.status !== "success") {
      return handleError(new Error("Failed to generate API key"), "server")
    }

    // Run Prisma commands
    await execAsync("npx prisma db push")
    await execAsync("npx prisma db seed")

    return {
      success: true,
      status: 200,
      data: {
        adminAccount: { username: values.ADMIN_USERNAME, email: adminEmail, password: values.ADMIN_PASSWORD },
        apiKey: generatedKey
      }
    }
  } catch (error: any) {
    console.error("SETUP_ACTION_ERROR:", error)
    // Return "Something went wrong" message for any error thrown during setup
    return { success: false, error: { message: "Something went wrong" } }
  }
}
