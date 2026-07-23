import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  fetch: globalThis.fetch
})

