import * as uuid from 'uuid/v1'
import isURL = require('is-url')
import logger from '../utils/logger'

// const DEFAULT = {
// 	request: {
// 		method: 'GET'
// 	},
// 	headers: {
// 		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
// 	}
// }
// TODO: remove performance
export default class Fetch{
  public fetcherID: string // fetcher ID
  public fetchID: string = uuid() // fetch ID
  public status: fetchStatus = fetchStatus.wait // fetch 状态
  public request: fetchRequest = {} as fetchRequest // 封装的请求
  public response: fetchResponse = {} as fetchResponse // 封装的响应
  public error: fetchError
  public constructor(req: fetchRequest) {
    if (!req.url) {
      logger.error(`fetch url undefnined!`)
      req.url = undefined
    } else if (!isURL(req.url)) {
      logger.warn(`request's url (maybe) not a conventional URL!`)
      req.url = undefined
    }
    this.request = req
  }
  public setFetcherID(ID: string) {
    this.fetcherID = ID
  }
}
