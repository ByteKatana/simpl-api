// Mock rate limiting to be a direct pass-through to simplify route testing
export const withRateLimit = (handler: any) => handler
