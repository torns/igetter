import * as request from 'superagent'

/**
 * create request from fetch.request
 */
export default function createRequest(reqOption: fetchRequest) {
  let req = new RequestBuilder(reqOption)
  req
    .buildMethodAndUrl()
    .buildHeaders()
    .buildQuery()
    .buildSendData()
    .buildRetry()
    .buildTimeOut()
    .buildRedirects()
    .buildNative()
  return req.getFetchRequest()
}

class RequestBuilder {
  private request: request.Request
  private reqOption: fetchRequest
  public constructor(fetchRequest: fetchRequest) {
    this.reqOption = fetchRequest
  }
  public getFetchRequest() {
    return this.request
  }
  public buildMethodAndUrl() {
    let method = this.reqOption.method || 'GET'
    let url = this.reqOption.url || '0.0.0.0'
    this.request = request(method, url)
    return this
  }
  public buildHeaders() {
    let headers = this.reqOption.headers || {}
    this.request.set(headers)
    return this
  }
  public buildQuery() {
    let query = this.reqOption.query
    if (query) {
      this.request.query(query)
    }
    return this
  }
  public buildSendData() {
    let data = this.reqOption.data
    if (data) {
      this.request.send(data)
    }
    return this
  }
  public buildRetry() {
    let retry = this.reqOption.retry
    if (retry) {
      this.request.retry(retry)
    }
    return this
  }
  public buildTimeOut() {
    let timeout = this.reqOption.timeout
    if (timeout) {
      this.request.timeout(timeout)
    }
    return this
  }
  public buildRedirects() {
    let redirects = this.reqOption.redirects
    if (redirects) {
      this.request.redirects(redirects)
    }
    return this
  }
  public buildNative() {
    this.reqOption._request = this.request
  }
}
