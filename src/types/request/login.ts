import { ResponseError, ResponseStatus } from "."

export interface LoginResponse {
  message: string
  status?: ResponseStatus
  error?: ResponseError
}