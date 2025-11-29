export * from "./login";

export interface StandardRequest {
    message : string, 
    status : ResponseStatus,
    error : ResponseError
}
export interface ResponseStatus {
    status: number
    message : string
}
export interface ResponseError {
    status : number
    message : string
}
