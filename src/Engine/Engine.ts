import * as EventEmitter  from 'events'
import Job from '../Job/Job'
import DownLoader from 'Downloader/Downloader'
import { engine as logger } from 'utils/logger';

export  class Engine extends EventEmitter{
	private num = 0
	private activeJob: Map<string,Job> = new Map()
	private waitJob: Job[] = []
	private JobPool: jobInfo[] = []
	private downloader: DownLoader
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
		}, 0);
	}
	schedul(){
		if (this.JobPool.length !== 0 && this.waitJob.length < 10) { // TODO: 精确调度
			logger.info(`push Job to waitJob queue from JobPool`)
			this.JobPool.forEach(customJob => {
				this.waitJob.push(new customJob.job())
			})
		}
		if (this.activeJob.size < 5 && this.waitJob.length > 0) {
			let job = this.waitJob.shift()
			this.activeJob.set(job.id, job)
			logger.info(`push job to activeJob from waitJob`)
		}
	}
	addJob(job: any){
		let jobInfo = {} as jobInfo
		jobInfo.job = job
		jobInfo.lastRun = NaN
		this.JobPool.push(jobInfo)
		logger.info(`A job was added`)
	}
	regHandle(){
		logger.debug(`Register engine's event`)
		this.addListener('fetch', (fetch: fetch) => {
			logger.info(`Engine recieve [fetcher] fetch: ${fetch.request.method} ${fetch.request.url}`)
			this.downloader.emit('fetch', fetch)
			
		})
		this.addListener('downloaded', (fetch: fetch) => {
			logger.info(`Engine recieve [downloader] downloaded: ${fetch.request.method} ${fetch.request.url}: ${fetch.response.status}`)
			this.activeJob.get(fetch.fetcherID).emit('downloaded', fetch)
		})
		this.addListener('attach', (instance: Job | DownLoader) => {
			if (instance instanceof Job) {
				this.activeJob.set(instance.id, instance)
				logger.info(`A job attached engine`)
			} else if (instance instanceof DownLoader) {
				this.downloader = instance
				logger.info(`A downloader attached engine`)
			}
		})
		this.addListener('detach', (job: Job) => {
			logger.info(`A job done was detached`)
			logger.info(`${this.num++}`)
			this.activeJob.delete(job.id)
		})
	}
}


