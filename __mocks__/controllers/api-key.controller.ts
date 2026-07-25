export const apiKeyController = jest.fn().mockImplementation(() => ({
  findKey: jest.fn().mockResolvedValue([{ key: "valid-key" }])
}))
