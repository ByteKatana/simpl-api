// Mock API key controller and utility checks
export const isSystemApiKey = jest.fn().mockImplementation((key: string) => key === "system-key")
export const isValidApiKey = jest.fn().mockImplementation((_keyData: any, key: string) => key === "valid-key")
