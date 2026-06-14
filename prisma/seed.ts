import { PrismaClient } from "@/prisma-client/client"
import { AppearanceMode, BuiltInPermGroup, DbDriver, IdentityManagementMode } from "@/interfaces"

const prisma = new PrismaClient()

async function main() {
  //Clean up database
  await prisma.settings.deleteMany()

  //Generate settings
  const general_settings = {
    site_name: "simpl:api",
    maintenance_mode: false,
    maintenance_msg: "We are currently undergoing maintenance. Please check back later.",
    db_driver: DbDriver.MONGO
  }

  //Identity settings
  const identity_settings = {
    management_mode: IdentityManagementMode.BUILT_IN,
    auth_methods: {
      built_in: {
        email_pw: true,
        passkeys: false,
        otp: false,
        two_fa: false
      },
      third_party: {
        github: false,
        gitlab: false,
        bitbucket: false,
        atlassian: false,
        vercel: false,
        netlify: false,
        google: false,
        apple: false,
        slack: false,
        zoom: false,
        notion: false,
        linkedin: false,
        click_up: false,
        yandex_cloud: false,
        maildotru: false,
        hugging_face: false
      }
    },
    open_registration: true,
    email_verification: true,
    default_perm_group: BuiltInPermGroup.VIEWER,
    profile_img_provider: "no-default"
  }

  // Api settings
  const api_settings = {
    service_rest_api: true,
    service_graphql: false,
    rate_limits: {
      time_window: 1, // minute
      req_per_window: 10, //request
      //max_req_per_ip: 100, //request
      //max_req_per_user: 100, //request
      time_interval: 100 //millisecond
    }
  }

  // Appearance settings
  const appearance_settings = {
    mode: AppearanceMode.SYSTEM
  }

  // Seed the database
  const all_settings = [
    {
      name: "general_settings",
      settings: general_settings,
      updated_at: new Date().toISOString()
    },
    {
      name: "identity_settings",
      settings: identity_settings,
      updated_at: new Date().toISOString()
    },
    {
      name: "api_settings",
      settings: api_settings,
      updated_at: new Date().toISOString()
    },
    {
      name: "appearance_settings",
      settings: appearance_settings,
      updated_at: new Date().toISOString()
    }
  ]

  const result = await prisma.settings.createMany({ data: all_settings })
  console.log("Seeding completed:", result)
}

// Initiate seeding
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("Error while seeding:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
