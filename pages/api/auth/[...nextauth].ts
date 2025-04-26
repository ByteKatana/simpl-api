import NextAuth, { Session } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { connectDB } from "../../../lib/mongodb"
import bcrypt from "bcryptjs"
import { JWT } from "next-auth/jwt"
import { MongoClient } from "mongodb"

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johndoe@email.com" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        let dbCollection: any[]
        let isConnected = false
        let client: MongoClient

        try {
          client = await connectDB()
          isConnected = true
        } catch (e) {
          console.error(e)
        }
        if (isConnected) {
          dbCollection = await client
            .db(process.env.DB_NAME)
            .collection(`users`)
            .find({ email: `${credentials.email}` })
            .toArray()
        }

        if (dbCollection.length > 0) {
          //check password is correct
          const isPwCorrect = bcrypt.compareSync(credentials.password, dbCollection[0].password)

          if (isPwCorrect) {
            return {
              id: dbCollection[0]._id,
              email: dbCollection[0].email,
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
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.user = user
      }
      return token
    },
    session: ({ session, token }: { session: Session; token: JWT }) => {
      if (token) {
        session.id = token.id
        session.user = token.user as any
      }
      return session
    }
  }
  /*pages: {
		signIn: "/login",
	}*/
})
