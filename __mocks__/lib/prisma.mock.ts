// Mock Prisma client operations to run queries completely in-memory
export const prisma = {
  entryType: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn()
  },
  permissionGroup: {
    findFirst: jest.fn(),
    update: jest.fn()
  }
}
