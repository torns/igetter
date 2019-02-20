import * as EventEmitter  from 'events'
import Job from '../Job/Job'
import DownLoader from 'Downloader/Downloader'
import { engine as logger } from 'utils/logger';

export  class Engine extends EventEmitter{
	private num = 0
	private activeJob: Map<string,Job> = new Map() // 正在执行的job
	private waitJob: Job[] = [] // 等待执行的job
	private JobPool: jobInfo[] = [] // 所有的Job
	private downloader: DownLoader // downloader
	constructor(){
		super()
		this.regHandle()
	}
	run(){
		this.schedul()
		this.activeJob.forEach(job => {
			if (!job.active) {
				job._run(this)
				job.active = true
			}
		})
		setTimeout(() => {
			this.run()
		}, 0)
	}
	schedul(){
		if (this.JobPool.length !== 0 && this.waitJob.length < 10) { // TODO: 精确调度
			this.JobPool.forEach(customJob => {
				let interval = Date.now() - customJob.lastRun
				interval /= 1000
				if (interval > customJob.job.minInterval) { // 间隔请求
					this.waitJob.push(customJob.job)
					customJob.lastRun = Date.now()
					logger.debug(`push [job] ${customJob.job.JobName} to waitJob queue`)
				}
			})
		}
		if (this.activeJob.size < 5 && this.waitJob.length > 0) {
			let job = this.waitJob.shift()
			this.activeJob.set(job.id, job)
			logger.debug(`push [job] ${job.JobName} to activeJob`)
		}
	}
	addJob(job: Job){ // 添加任务的class
		let jobInfo = {} as jobInfo
		jobInfo.job = job // 任务
		jobInfo.lastRun = Number(new Date(1998, 2, 16)) // 上一次运行时间
		this.JobPool.push(jobInfo)
		logger.info(`[job] ${job.JobName} was added.`)
		logger.debug(`[job] ${job.JobName}'s ID: ${job.id}.`)
	}
	regHandle(){
		logger.debug(`Register engine's event`)
		this.addListener('fetch', (fetch: fetch) => {
			logger.debug(`Engine recieve [fetcher] fetch: ${fetch.request.method} ${fetch.request.url}`)
			this.downloader.emit('fetch', fetch)
		})
		this.addListener('downloaded', (fetch: fetch) => {
			logger.debug(`Engine recieve [downloader] downloaded: ${fetch.request.method} ${fetch.request.url}: ${fetch.response.status}`)
			this.activeJob.get(fetch.fetcherID).emit('downloaded', fetch)
		})
		this.addListener('attach', (instance: Job | DownLoader) => {
			if (instance instanceof Job) {
				this.activeJob.set(instance.id, instance)
				logger.info(`[job] ${instance.JobName} attached engine`)
			} else if (instance instanceof DownLoader) {
				this.downloader = instance
				logger.info(`A downloader attached engine`)
			}
		})
		this.addListener('detach', (job: Job) => {
			logger.info(`[job] ${job.JobName} was detached`)
			logger.info(`${this.num++}`)
			job.active = false
			this.activeJob.delete(job.id)
		})
	}
}


