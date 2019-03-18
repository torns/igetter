import { Response } from 'superagent'

/**
 * create fetch.response from request response
 */
export default function createRespone(response: Response, fetchRespone: fetchResponse) {
  let res = new ResponseBuilder(response, fetchRespone)
  res
    .buildStatus()
    .buildBody()
    .buildHeaders()
    .buildNative()

  return res.getFetchResponse()
}
class ResponseBuilder{
  private res: Response
  private fetchRes: fetchResponse
  public constructor(res: Response, fetchRespone: fetchResponse) {
    this.res = res
    this.fetchRes = fetchRespone
  }
  public getFetchResponse() {
    return this.fetchRes
  }
  public buildStatus() {
    this.fetchRes.status = this.res.status
    return this
  }
  public buildBody() {
    if (Object.entries(this.res.body).length) {
      this.fetchRes.body = this.res.body
    } else {
      this.fetchRes.body = this.res.text
    }
    return this
  }
  public buildHeaders() {
    this.fetchRes.headers = this.res.header
    return this
  }
  public buildNative() {
    this.fetchRes._response = this.res
    return this
  }
}
