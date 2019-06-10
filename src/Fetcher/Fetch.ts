import * as uuid from 'uuid/v1'
import {
  OutgoingHttpHeaders,
  IncomingHttpHeaders
} from 'http'
import isURL = require('is-url')
import logger from '../utils/logger'

const enum fetchStatus {
  wait = 'WAIT', // wait fetch request
  request = 'REQUEST', // wait result after requested
  success = 'SUCCESS', // get result
  faile = 'FAILE' // request failed
}

export interface fetchRequest {
  method?: string,
  url: string,
  headers?: OutgoingHttpHeaders,
  query?: object,
  data?: any,
  retry?: number,
  timeout?: number,
  redirects?: number,
  _request?: any
}
export interface fetchResponse {
  status: number,
  body: any,
  headers: IncomingHttpHeaders
  _response?: any
}
export interface fetchError {
  message: string,
  status: number | string,
  response: any,
  _error: any
}
export default class Fetch{
  public fetcherID: string // fetcher ID
  public fetchID: string = uuid() // fetch ID
  public status: fetchStatus = fetchStatus.wait // fetch 状态
  public request: fetchRequest = {} as fetchRequest // 封装的请求
  public response: fetchResponse = {} as fetchResponse // 封装的响应
  public error: fetchError
  public constructor(req: fetchRequest, ID: string) {
    if (!isURL(req.url)) {
      logger.warn(`request's url (maybe) not a conventional URL!`)
      req.url = undefined
    }
    this.fetcherID = ID
    this.request = req
  }
}
