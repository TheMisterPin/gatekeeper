import { ResponseError, ResponseStatus } from "."

export interface LoginResponse {
  message: string
  status?: ResponseStatus
  resourceFullName?: string
  error?: ResponseError
}