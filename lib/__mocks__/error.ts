const handleError = jest.fn((error) => ({
  success: false,
  error: {
    message: error instanceof Error ? error.message : String(error),
  },
}));

export default handleError;
