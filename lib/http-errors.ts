export class RequestError extends Error {
  statusCode: number
  errors?: Record<string, string[]> | undefined
  constructor(statusCode: number, message: string, errors?: Record<string, string[]> | undefined) {
    super(message)
    this.statusCode = statusCode
    this.name = "RequestError"
    this.errors = errors
  }
}
