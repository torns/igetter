import * as $ from 'cheerio'
import Fetcher from '../Fetcher/Fetcher'
import { job as logger } from '../utils/logger'
import md5 = require('blueimp-md5')
import Engine from '../Engine/Engine'

export default abstract class Job extends Fetcher{
  public isActive = false // job whether active
  public minInterval = 10  // min run interval (s)
  public JobName = 'IGetter Job' // job name // TODO: undefined name avoid use store
  public VERSION = '1.0' // job majorVer, decide store files name
  public $ = $ // parse lib
  public constructor() {
    super()
    this.addListener('run', (engine: Engine) => {
      this._run(engine)
    })
  }
  /**
   * start job, include attach engine, run user script, save store, detach engine
   */
  private async _run(engine: Engine) {
    this.checkJob()
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
  private checkJob() {
    if (this.JobName === 'IGetter Job') {
      logger.warn(`Job's Name is default name, NOT recommend!`)
    }
  }
  public setID(){
    this.id =  md5(this.JobName, this.VERSION)
  }
  public getStore(id?: string){
    return this.engine.getStore(id || this.id)
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
}
