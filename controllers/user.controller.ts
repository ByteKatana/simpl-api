//Database
import { prisma } from "@/lib/prisma"
import { User as PrismaUser } from "@/prisma-client/client"
import bcrypt from "bcryptjs"

//Interface
import { User } from "@/interfaces/user"

export class UserController {
  user: User
  mockClient: boolean

  constructor(userData: User, mockClient: boolean = false) {
    this.user = userData
    this.mockClient = mockClient
  }

  async create() {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }

    if (client && isConnected) {
      let insertResult: PrismaUser | undefined
      try {
        const plainPw = this.user.password
        const hashPw = bcrypt.hashSync(plainPw, 8)
        insertResult = await prisma.user.create({
          data: {
            email: this.user.email,
            fullname: this.user.fullname,
            password: hashPw,
            permission_group: this.user.permission_group,
            profile_img: this.user.profile_img || "",
            status: this.user.status,
            username: this.user.username,
            email_verified: this.user.email_verified || false,
            oauth_id: this.user.oauth_id,
            oauth_provider: this.user.oauth_provider,
            created_at: this.user.created_at,
            created_by: this.user.created_by,
            updated_at: this.user.updated_at,
            updated_by: this.user.updated_by
          }
        })

        if (insertResult && insertResult.id) {
          if (this.mockClient) {
            return { result: { status: "success", message: "User has been created." }, userId: insertResult.id }
          }

          return { status: "success", message: "User has been created." }
        } else {
          return { status: "failed", message: "Failed to create the user." }
        }
      } catch (e) {
        console.log(e)
        return { status: "failed", message: "Failed to create the user." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async update(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }

    if (client && isConnected) {
      let updateResult: PrismaUser | undefined
      let isDifferent = false
      try {
        const prevState = await prisma.user.findUnique({
          where: { id: id }
        })

        const hasPasswordChange =
          this.user.password !== "" &&
          this.user.password !== undefined &&
          this.user.password !== null &&
          prevState?.password !== this.user.password

        isDifferent =
          prevState !== null &&
          (prevState.fullname !== this.user.fullname ||
            prevState.username !== this.user.username ||
            prevState.email !== this.user.email ||
            prevState.profile_img !== this.user.profile_img ||
            prevState.status !== this.user.status ||
            prevState.permission_group !== this.user.permission_group ||
            prevState.oauth_id !== this.user.oauth_id ||
            prevState.oauth_provider !== this.user.oauth_provider ||
            hasPasswordChange)

        const updateData: any = {
          fullname: this.user.fullname,
          username: this.user.username,
          email: this.user.email,
          profile_img: this.user.profile_img || "",
          status: this.user.status,
          permission_group: this.user.permission_group,
          oauth_id: this.user.oauth_id,
          oauth_provider: this.user.oauth_provider,
          updated_at: new Date().toISOString()
        }

        if (this.user.password !== "" && this.user.password !== undefined && this.user.password !== null) {
          updateData.password = this.user.password
        }

        updateResult = await prisma.user.update({
          where: { id: id },
          data: updateData
        })
      } catch (e) {
        console.log(e)
      }

      if (updateResult && isDifferent) {
        return { status: "success", message: "User has been updated." }
      } else if (updateResult && !isDifferent) {
        return { status: "failed", message: "You didn't make any change." }
      } else {
        return { status: "failed", message: "Failed to update the user." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }

  async delete(id: string) {
    const client = prisma
    let isConnected = false

    try {
      isConnected = true
    } catch (e) {
      console.log(e)
    }
    if (client && isConnected) {
      let deleteResult: { count: number } | undefined
      try {
        deleteResult = await prisma.user.deleteMany({
          where: { id: id }
        })
      } catch (e) {
        console.log(e)
      }

      if (deleteResult && deleteResult.count >= 1) {
        return { status: "success", message: "User has been deleted." }
      } else {
        return { status: "failed", message: "Failed to delete the user." }
      }
    } else {
      return [{ message: "Database connection is NOT established" }]
    }
  }
}
