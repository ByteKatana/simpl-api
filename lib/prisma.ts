import "dotenv/config"
import { PrismaClient } from "@/prisma-client/client"

const prisma = new PrismaClient()

export { prisma }
