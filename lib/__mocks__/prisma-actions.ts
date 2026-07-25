export const prisma = {
  permissionGroup: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  apiRequestLog: {
    findMany: jest.fn(),
    aggregate: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    aggregateRaw: jest.fn(),
  },
  entry: {
    count: jest.fn(),
  },
  entryType: {
    count: jest.fn(),
  },
  user: {
    count: jest.fn(),
  },
  $transaction: jest.fn((promises) => Promise.all(promises)),
};
