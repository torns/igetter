import { Response } from 'superagent'
import { fetchError } from '../Fetcher/Fetch';

export default function createError(error: any, fetchError: fetchError) {
  let err = new ErrorBuilder(error, fetchError)
  err
    .buildMessage()
    .buildResponse()
    .buildStatus()
    .buildNative()

  return err.getFetchError()
}
interface requestError{
  message: string,
  response: Response | undefined,
  code?: string,
  status?: number
}
class ErrorBuilder{
  private error: requestError
  private fetchError: fetchError
  public constructor(error: requestError, fetchError: fetchError) {
    this.error = error
    this.fetchError = fetchError
  }
  public getFetchError() {
    return this.fetchError
  }
  public buildMessage() {
    this.fetchError.message = this.error.message
    return this
  }
  public buildStatus() {
    this.fetchError.status = this.error.status || this.error.code
    return this
  }
  public buildResponse() {
    this.fetchError.response = this.error.response
    return this
  }
  public buildNative() {
    this.fetchError._error = this.error
    return this
  }
}
