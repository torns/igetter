import { SyncHook } from 'tapable'
import * as EventEmitter  from 'events'
import Job from '../Job/Job'
import DownLoader from '../Downloader/Downloader'
import Fetch from '../Fetcher/Fetch'
import { engine as logger } from '../utils/logger'
import Plugin from '../Plugin/Plugin'

export default class Engine extends EventEmitter{
	private num = 0 // compeleted job count
	private activeJob: Map<string,Job> = new Map() // executing job
	private waitJob: Job[] = [] // 等待执行的job
	private JobPool: Map<string, jobInfo> = new Map() // all job
	private downloader: DownLoader // downloader
	public hooks:Hooks = {
		beforeFetch: new SyncHook(['fetch']),
		fetching: new SyncHook(['request']),
		afterFetch: new SyncHook(['fetch'])
	}
	constructor(){
		super()
		this.regHandle()
	}
	/**
	 * start engine, schedule, execute job
	 */
	async run(){
		this.schedul()
		this.activeJob.forEach(job => {
			if (!job.isActive) {
				job.active()
				job._run(this)
			}
		})
		setTimeout(() => {
			this.run()
		}, 0)
	}
	/**
	 * push job to waitJob queue from JobPool,
	 * push job to execute queue from waitJob
	 */
	async schedul(){
		if (this.JobPool.size !== 0 && this.waitJob.length < 10) { // TODO: 精确调度
			this.JobPool.forEach(async (jobInfo, key) => {
				let {job, lastRun} = jobInfo
				if (job.isActive) {
					return
				}
				let willRun = await job.willRun()
				if (willRun) {
					let interval = Date.now() - lastRun
					interval /= 1000
					if (interval > job.minInterval) { // interval request prevent server ban ip
						this.waitJob.push(job)
						jobInfo.lastRun = Date.now()
						logger.debug(`[job] ${job.JobName} waiting.`)
					}
				}
			})
		}
		if (this.activeJob.size < 5 && this.waitJob.length > 0) {
			let job = this.waitJob.shift()
			this.activeJob.set(job.id, job)
			let jobInfo = this.JobPool.get(job.id)
			jobInfo.startTime = Date.now()
			this.JobPool.set(job.id, jobInfo)
			logger.info(`[job] ${job.JobName} ID: ${job.id} active.`)
		}
	}
	// TODO: jobinfo JobPoll independence
	/**
	 * add job to JobPoll with job info
	 */
	addJob(job: Job){
		job.setID()
		let jobInfo = {} as jobInfo
		jobInfo.job = job
		jobInfo.lastRun = Number(new Date(1998, 2, 16))
		this.JobPool.set(job.id, jobInfo)
		logger.debug(`[job] ${job.JobName} ${job.id} added.`)
	}
	/**
	 * get active job queue
	 */
	getActiveJob(){
		return this.activeJob
	}
	/**
	 * add plugin to engine
	 */
	use(Plugin : Plugin){
		Plugin._apply(this.hooks)
	}
	/**
	 * register event
	 */
	private regHandle(){
		logger.debug(`Register engine's event`)
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
			logger.debug(`[job] ${job.id} ${job.JobName} was detached`)
			job.inactive()
			this.activeJob.delete(job.id)
			let jobInfo = this.JobPool.get(job.id)
			jobInfo.endTime = Date.now()
			this.JobPool.set(job.id, jobInfo)
			logger.info(`[job] ${job.id} ${job.JobName} done, spent time: ${jobInfo.endTime - jobInfo.startTime}`)
		})
	}
}
process.on('unhandledRejection', (reason: Error|any, p: Promise<any>) => {
	debugger
	logger.error(`unhandled rejection, reason: ${reason}`)
})

