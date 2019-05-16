import * as $ from 'cheerio'
import Fetcher from '../Fetcher/Fetcher'
import { job as logger } from '../utils/logger'
import md5 = require('blueimp-md5')
import Engine from '../Engine/Engine'

/**
 * job
 */
export default abstract class Job extends Fetcher{
  public isActive = false // job whether run
  public minInterval = 10  // min run interval (s)
  public JobName = 'Job' // job name // TODO: undefined name avoid use store
  public majorVer = '1' // job majorVer, decide store files name
  public minorVer = '0'// job minorVer
  public $ = $ // analyze lib
  public constructor() {
    super()
  }
  /**
   * start job, include attach engine, run user script, save store, detach engine
   * NOT CALL
   */
  public async _run(engine: Engine) {
    this.attachEngine(engine)
    logger.debug(`[job] ${this.JobName} ${this.id} start`)
    let res = await this.run()
    if (res) {
      this.engine.emit('data', {
        data: res,
        id: this.id
      })
    }
    logger.debug(`[job] ${this.JobName} ${this.id} end`)
    this.detachEngine()
  }
  /**
   * save store form job run
   */
  public active() {
    this.isActive = true
  }
  /**
   * change status, release callback func
   */
  public inactive() {
    this.isActive = false
    this.callBacks.clear()
    this.queue.clear()
  }
  /**
   * set job id
   */
  public setID() {
    this.id =  md5(this.JobName, this.majorVer) // key + class.name generate md5
    return this.id
  }
  /**
   * attach engine
   */
  public attachEngine(engine: Engine) {
    this.engine = engine
    this.engine.emit('attach', this)
    logger.debug(`[job] ${this.JobName} ${this.id} attach engine`)
  }
  /**
   * detach engine
   */
  public detachEngine() {
    this.engine.emit('detach', this)
    logger.debug(`[job] ${this.JobName} ${this.id} detach engine`)
  }
  /**
   * request url, resolve response, return result
   */
  public abstract async run(): Promise<any>
  /**
   * whether push to wait job queue
   */
  public async willRun() {
    return true
  }
}
