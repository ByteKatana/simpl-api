import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./lib/mongodb"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { MongoClient } from "mongodb"

/**
 * Auth.js v5 Configuration
 *
 * This configuration handles:
 * - Credentials-based authentication with MongoDB
 * - Custom session data (id, username, permission_group)
 * - JWT strategy for session management
 */
export const config = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johndoe@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        let dbCollection: any[]
        let isConnected = false
        let client: MongoClient

        try {
          client = await connectDB()
          isConnected = true
        } catch (e) {
          console.error("MongoDB connection error:", e)
          return null
        }

        if (isConnected) {
          try {
            dbCollection = await client
              .db(process.env.DB_NAME)
              .collection("users")
              .find({ email: `${credentials.email}` })
              .toArray()
          } catch (e) {
            console.error("Database query error:", e)
            return null
          }
        } else {
          return null
        }

        if (dbCollection.length > 0) {
          // Check if password is correct
          const isPwCorrect = bcrypt.compareSync(
            credentials.password as string,
            dbCollection[0].password
          )

          if (isPwCorrect) {
            // Return user object with custom fields
            return {
              id: dbCollection[0]._id.toString(),
              email: dbCollection[0].email,
              name: dbCollection[0].username,
              username: dbCollection[0].username,
              permission_group: dbCollection[0].permission_group
            }
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    /**
     * JWT Callback - Called when JWT is created/updated
     * Adds custom fields to the token
     */
    jwt({ token, user }) {
      if (user) {
        // Flatten user data directly into token (v5 pattern)
        token.id = user.id
        token.username = user.username
        token.permission_group = user.permission_group
      }
      return token
    },
    /**
     * Session Callback - Called when session is checked
     * Adds custom fields from token to session
     */
    session({ session, token }) {
      if (token && session.user) {
        // Map token data to session
        session.id = token.id as string
        session.user.username = token.username as string
        session.user.permission_group = token.permission_group as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  }
} satisfies NextAuthConfig

// Export Auth.js v5 handlers and helper functions
export const { handlers, auth, signIn, signOut } = NextAuth(config)
