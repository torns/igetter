import * as EventEmitter from 'events'
import { fetcher as logger } from '../utils/logger'
import Fetch, { fetchRequest } from './Fetch'
import Engine from '../Engine/Engine'

export default class Fetcher extends EventEmitter{
  public id: string // fetcher id
  public engine: Engine
  protected queue: Map<string, Fetch> = new Map() // save this fetcher's fetch
  protected callBacks: Map<string, Function> = new Map() // request callback function

  public constructor() {
    super()
    this.addListener('downloaded', (resFetch: Fetch) => {
      let cb = this.callBacks.get(resFetch.fetchID)
      cb(resFetch)
    })
  }
  /**
   * request fetch
   */
  public async request(req: fetchRequest, cb?: Function) {
    let fetchID = this.push(req)
    return new Promise<Fetch>((resolve, reject) => {
      this.waitDownload(fetchID, (resFetch: Fetch) => {
        if (cb) {
          cb(resFetch)
        }
        resolve(resFetch)
      })
    })
  }
  /**
   * reuqest multi fetch, can set callback for every fetch downloaded
   */
  public async requests(reqs: fetchRequest[], cb?: Function) {
    let requests = [] as Promise<Fetch>[]
    reqs.forEach(req => {
      requests.push(this.request(req, cb))
    })
    return Promise.all(requests)
  }
  /**
   * construct fetch, emit to engine
   */
  private push(req: fetchRequest): Fetch['fetchID'] {
    logger.info(`[Fetcher] ${this.id} recieve job request ${req.method || 'GET'} ${req.url}`)
    let fetch = new Fetch(req, this.id)
    this.queue.set(fetch.fetchID, fetch)
    if (this.engine) {
      this.engine.emit('fetch', fetch)
      logger.info(`[Fetcher] ${this.id} send fetch to Engine ${fetch.request.method} ${fetch.request.url}`)
    } else {
      logger.error(`Engine not attach!`)
    }
    return fetch.fetchID
  }
  /**
   * wait engine return result
   */
  private waitDownload(fetchID: Fetch['fetchID'], cb: Function) {
    this.callBacks.set(fetchID, cb)
  }
  // TODO: support RSS
}
