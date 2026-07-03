import { NextResponse } from "next/server"
import { ActionResponse, ResponseType } from "@/interfaces"
import { RequestError } from "@/lib/http-errors"

function formatResponse<T = any>(
  responseType: "api",
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
): NextResponse
function formatResponse<T = any>(
  responseType: "server",
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
): ActionResponse<T>
function formatResponse<T = any>(
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
): ActionResponse<T> | NextResponse {
  const resContent = {
    success: false,
    error: {
      message,
      details: errors
    }
  }

  return responseType === "api"
    ? NextResponse.json(resContent, { status })
    : { status, success: false, error: resContent.error }
}

function errorlogger(error: Error) {
  console.error("Error caught:", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })
}

function handleError<T = any>(error: unknown, responseType: "api"): NextResponse
function handleError<T = any>(error: unknown, responseType: "server"): ActionResponse<T>
function handleError<T = any>(error: unknown, responseType?: ResponseType): ActionResponse<T> | NextResponse
function handleError<T = any>(error: unknown, responseType: ResponseType = "server"): ActionResponse<T> | NextResponse {
  if (error instanceof RequestError) {
    errorlogger(error)
    return formatResponse<T>(responseType as any, error.statusCode, error.message, error.errors)
  }

  if (error instanceof Error) {
    errorlogger(error)
    return formatResponse<T>(responseType as any, 500, error.message)
  }

  return formatResponse<T>(responseType as any, 500, "Internal Server Error")
}

export default handleError
