import { SyncHook } from 'tapable'
import * as EventEmitter from 'events'
import { engine as logger, switchLog } from '../utils/logger'
import DownLoader from '../Downloader/Downloader'
import Fetch from '../Fetcher/Fetch'
import Job from '../Job/Job'
import JobPool from '../Job/JobPool'
import Plugin from '../Plugin/Plugin'
import Stores from '../Store/Stores'

interface config{
  concurrency?: number, // download concurrency,
  isLog?: boolean // open log
}
export interface Hooks{
  beforeFetch: SyncHook,
  fetching: SyncHook,
  afterFetch: SyncHook
}

export default class Engine extends EventEmitter{
  public isActive = false
  public config: config = {
    concurrency: 4,
    isLog: false
  }
  public hooks: Hooks = {
    beforeFetch: new SyncHook(['fetch']),
    fetching: new SyncHook(['request']),
    afterFetch: new SyncHook(['fetch'])
  }
  public activeJob: Map<string, Job> = new Map() // executing job
  private downloader: DownLoader // downloader
  private stores: Stores // stores, save data
  private jobPool: JobPool
  private consumer: Function[] = [] // consumer, consume data

  public constructor(config: config) {
    super()
    this.setConfig(config)
    this.regHandle()
    this.stores = new Stores()
    this.jobPool = new JobPool()
  }
  // TODO: read config
  /**
   * launch engine, get and execute job
   */
  public async run() {
    this.isActive = true
    let lack = this.config.concurrency - this.activeJob.size
    if (lack) {
      this.jobPool.getWaitJobs(lack).forEach(job => {
        this.activeJob.set(job.id, job)
      })
    }
    this.activeJob.forEach(job => {
      if (!job.isActive) {
        job.active()
        job.emit('run', this)
      }
    })
    setTimeout(() => {
      if (!this.isActive) return
      this.run()
    }, 0)
  }
  public stop() {
    this.isActive = false
  }
  /**
   * add job to JobPool with job info
   */
  public addJob(job: Job) {
    this.jobPool.addJob(job)
  }
  /**
   * add plugin to engine
   */
  public use(Plugin: Plugin) {
    Plugin._apply(this.hooks)
  }
  public setConfig(config: config) {
    this.config = {
      ...this.config,
      ...config
    }
    switchLog(this.config.isLog)
  }
  public getStore(id: string) {
    let store = this.stores.getStore(id)
    return store
  }
  public listen(cb: Function) {
    this.consumer.push(cb)
  }
  /**
   * register event
   */
  private regHandle() {
    this.addListener('fetch', (fetch: Fetch) => { // Job fetch resuest
      logger.debug(`Engine recieve [fetcher] ${fetch.fetcherID} [fetch] ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}`)
      this.hooks.beforeFetch.call(fetch)
      this.downloader.emit('fetch', fetch)
    })
    this.addListener('downloaded', (fetch: Fetch) => { // Downloader return response
      logger.debug(`Engine recieve [downloader] downloaded: ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}: ${fetch.response.status}`)
      this.hooks.afterFetch.call(fetch)
      this.activeJob.get(fetch.fetcherID).emit('downloaded', fetch)
    })
    this.addListener('attach', (instance: Job | DownLoader) => { // Job and Downloader attach Engine
      if (instance instanceof Job) {
        this.activeJob.set(instance.id, instance)
        logger.debug(`[job] ${instance.id} ${instance.JobName} attached engine`)
      } else if (instance instanceof DownLoader) {
        this.downloader = instance
        logger.debug(`[downloader] attached engine`)
      }
    })
    this.addListener('detach', (job: Job) => {
      job.inactive()
      this.activeJob.delete(job.id)
      this.jobPool.setLastrun(job.id)
      logger.info(`[job] ${job.id} ${job.JobName} done.`)
    })
    this.addListener('data', (res: any) => {
      this.consumer.forEach(cb => {
        cb(res)
      })
      //  this.stores.setLast(res.id, res.data)
    })
  }
}
process.on('unhandledRejection', (reason: Error | any, p: Promise<any>) => {
  logger.error(`unhandled rejection, reason: ${reason}`)
})

