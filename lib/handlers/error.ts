import { NextResponse } from "next/server"
import { ResponseType } from "@/interfaces"
import { RequestError } from "@/lib/http-errors"
function formatResponse(
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) {
  const resContent = {
    success: false,
    error: {
      message,
      details: errors
    }
  }

  return responseType === "api" ? NextResponse.json(resContent, { status }) : { status, ...resContent }
}

function errorlogger(error: Error) {
  console.error("Error caught:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })
}

function handleError(error: unknown, responseType: ResponseType = "server") {
  if (error instanceof RequestError) {
    errorlogger(error)
    return formatResponse(responseType, error.statusCode, error.message, error.errors)
  }

  if (error instanceof Error) {
    errorlogger(error)
    return formatResponse(responseType, 500, error.message)
  }

  return formatResponse(responseType, 500, "Internal Server Error")
}

export default handleError
