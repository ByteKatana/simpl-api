import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./lib/mongodb"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { uid } from "uid"

// Actions and Helpers
import createUser from "@/lib/actions/studio/users/create-user"
import checkUserEmailExist from "@/lib/check-user-email-exist"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import updateUser from "@/lib/actions/studio/users/update-user"
import handleError from "@/lib/handlers/error"
import checkUserOAuthExist from "@/lib/check-user-oauth-exist"

// Provider Imports
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import GitLab from "next-auth/providers/gitlab"
import Bitbucket from "next-auth/providers/bitbucket"
import Atlassian from "next-auth/providers/atlassian"
import Apple from "next-auth/providers/apple"
import Slack from "next-auth/providers/slack"
import Zoom from "next-auth/providers/zoom"
import LinkedIn from "next-auth/providers/linkedin"
import ClickUp from "next-auth/providers/click-up"
import Yandex from "next-auth/providers/yandex"
import Netlify from "next-auth/providers/netlify"
import Huggingface from "next-auth/providers/huggingface"
import Mailru from "next-auth/providers/mailru"
import { UserStatus } from "@/interfaces"

/**
 * Standardizes the user profile from OAuth providers to match our User interface.
 */
const standardizeProfile = (profile: any, idField = "id", imgField = "picture") => {
  return {
    id: profile[idField]?.toString() || profile.sub?.toString(),
    email: profile.email,
    name: profile.name || profile.display_name || profile.login || "OAuth User",
    username: profile.login || profile.username || profile.preferred_username || profile.email?.split("@")[0],
    permission_group: "viewer", // Default for new users
    profile_img: profile[imgField] || profile.avatar_url || profile.image || profile.picture || "",
    status: UserStatus.Active as const
  }
}

export const config = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    // Passkey,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await connectDB()
        const user = await client.db(process.env.DB_NAME).collection("users").findOne({ email: credentials.email })

        if (user && bcrypt.compareSync(credentials.password as string, user.password)) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullname,
            username: user.username,
            permission_group: user.permission_group,
            profile_img: user.profile_img,
            status: user.status,
            email_verified: true
          }
        }
        return null
      }
    }),
    // OAuth Providers
    GitHub({
      profile(profile) {
        return standardizeProfile(profile, "id", "avatar_url")
      }
    }),
    GitLab({
      profile(profile) {
        return standardizeProfile(profile, "id", "avatar_url")
      }
    }),
    Google({
      profile(profile) {
        return standardizeProfile(profile, "sub", "picture")
      }
    }),
    Bitbucket({
      profile(profile) {
        return standardizeProfile(profile, "uuid", "links.avatar.href")
      }
    }),
    Atlassian({
      profile(profile) {
        return standardizeProfile(profile, "account_id", "picture")
      }
    }),
    Apple({
      profile(profile) {
        return standardizeProfile(profile, "sub")
      }
    }),
    Slack({
      profile(profile) {
        return standardizeProfile(profile, "sub", "picture")
      }
    }),
    Zoom({
      profile(profile) {
        return standardizeProfile(profile, "id", "pic_url")
      }
    }),
    LinkedIn({
      profile(profile) {
        return standardizeProfile(profile, "sub", "picture")
      }
    }),
    ClickUp({
      profile(profile) {
        return standardizeProfile(profile, "id", "profilePicture")
      }
    }),
    Huggingface({
      profile(profile) {
        return standardizeProfile(profile, "sub", "picture")
      }
    }),
    Yandex({
      profile(profile) {
        return standardizeProfile(profile, "id", "default_avatar_id")
      }
    }),
    Mailru({
      profile(profile) {
        return standardizeProfile(profile, "id", "image")
      }
    }),
    Netlify({
      profile(profile) {
        return standardizeProfile(profile, "id", "avatar_url")
      }
    }),
    {
      id: "vercel",
      name: "Vercel",
      type: "oauth",
      authorization: "https://vercel.com/oauth/authorize",
      token: "https://api.vercel.com/v2/oauth/access_token",
      userinfo: "https://api.vercel.com/v2/user",
      profile(profile: any) {
        return {
          id: profile.user.uid,
          email: profile.user.email,
          name: profile.user.name,
          username: profile.user.username,
          permission_group: "viewer",
          profile_img: profile.user.avatar,
          status: UserStatus.Active
        }
      }
    }
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        try {
          // if (account?.provider === "passkey") return true
          // 1. Always find the user by email first
          const proverId = account?.providerAccountId.toString()
          const oauthProvider = account?.provider
          const trustedProviders = [
            "github",
            "gitlab",
            "bitbucket",
            "netlify",
            "click-up",
            "zoom",
            "huggingface",
            "mailru",
            "yandex",
            "vercel"
          ]

          const emailVerified = profile?.email_verified || trustedProviders.includes(account?.provider as string)

          // 2. Identify the correct user
          // First priority: Match BOTH oauth_id AND oauth_provider (Exact connection match)
          const client = await connectDB()
          const usersCollection = client.db(process.env.DB_NAME).collection("users")

          const existingUsersByEmail = await usersCollection.find({ email: user.email }).toArray()
          const existingUsersByOAuth = await usersCollection.find({ oauth_id: proverId }).toArray()

          let dbUser = existingUsersByOAuth.find(
            (u: any) => u.oauth_id === proverId && u.oauth_provider === oauthProvider
          )

          // Second priority: Fallback to matching by email (Account linking scenario)
          if (!dbUser && existingUsersByEmail.length > 0) {
            dbUser = existingUsersByEmail[0]
          }

          const defaultPermGroup = await getSettingsValue("identity_settings", "default_perm_group")

          if (!dbUser && emailVerified) {
            const newUser = {
              fullname: user.name || "OAuth User",
              username: user.username || user.email?.split("@")[0] || uid(8),
              email: user.email!,
              profile_img: user.profile_img || user.image || "",
              status: UserStatus.Active,
              permission_group: defaultPermGroup,
              oauth_provider: oauthProvider,
              oauth_id: proverId,
              password: `${account?.provider}-${user.id}-${uid(16)}!A1`
            }

            const response = await createUser(newUser as any, true)
            if ("error" in response || !response.success) {
              return handleError(new Error("Failed to register user profile"))
            }

            user.permission_group = newUser.permission_group
            user.status = newUser.status
          } else {
            // 2. User exists. Check if we need to link the OAuth ID
            // If the user doesn't have an oauth_id yet, or if it was different,
            // we update it ONCE to bind this OAuth account to this email.
            const isNewConnection = !dbUser.oauth_id

            // Security Check: If they HAVE an oauth_id, it MUST match the current provider
            // This prevents someone from "hijacking" an account if they somehow get the same oauth_id
            // from a different provider, unless the email also matches.
            if (!isNewConnection && dbUser.oauth_id !== proverId && dbUser.oauth_provider !== oauthProvider) {
              return handleError(new Error("Invalid OAuth connection!"))
            }

            const isDataOutdated =
              dbUser.fullname !== user.name ||
              dbUser.username !== user.username ||
              dbUser.profile_img !== user.profile_img

            if (isNewConnection || isDataOutdated) {
              const updateResponse = await updateUser(
                {
                  oauth_id: proverId,
                  fullname: user.name || dbUser.fullname,
                  username: user.username || dbUser.username,
                  profile_img: user.profile_img || dbUser.profile_img,
                  status: dbUser.status,
                  email: dbUser.email,
                  permission_group: dbUser.permission_group,
                  password: ""
                },
                dbUser,
                dbUser._id,
                true
              )
              if ("error" in updateResponse || !updateResponse.success) {
                return handleError(new Error("Failed to update user profile"))
              }
            }

            // 3. CRITICAL: Map the DB ID to the session 'user' object
            // This ensures the rest of your app uses the MongoDB _id, not the Google 'sub'
            user.id = dbUser._id.toString()
            user.permission_group = dbUser.permission_group
            user.status = dbUser.status
          }
        } catch (error) {
          console.error("Error during OAuth sign-in check:", error)
          return false
        }
      }

      if (user.status === UserStatus.Disabled) return false //User banned
      return true
    },
    async jwt({ token, user, account, trigger }) {
      // During initial sign-in, the 'user' object is available
      if (user) {
        token.id = user.id
        token.username = user.username
        token.permission_group = user.permission_group
        token.profile_img = user.profile_img
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.id = token.id as string
        session.user.username = token.username as string
        session.user.permission_group = token.permission_group as string
        session.user.profile_img = token.profile_img as string
        session.user.status = token.status as string
      }
      return session
    }
  },
  pages: { signIn: "/login" },
  experimental: {
    enableWebAuthn: true
  },
  session: { strategy: "jwt" }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
