import Engine = require('Engine/Engine')
import Fetcher from 'Fetcher/Fetcher'
import { job as logger } from 'utils/logger'
import Fetch from 'Fetcher/Fetch'

// TODO: once job
export default abstract class Job extends Fetcher{
	public active: boolean = false // 标记任务是否正在执行
	public minInterval: number = 10  // 最小执行间隔(分钟)
	public JobName: string = 'Job' // 任务名称
	constructor(){
		super()
	}
	async _run(engine: Engine.Engine){
		this.attachEngine(engine)
		logger.debug(`[job] ${this.JobName} ${this.id} start`)
		await this.run()
		logger.debug(`[job] ${this.JobName} ${this.id} end`)
		this.detachEngine()
	}
	request(req: fetchRequest){
		logger.info(`[job] ${this.JobName} ${this.id} request ${req.method} ${req.url}`)
		let reqID = this.push(req)
		return new Promise<Fetch>((resolve, reject) => {
			this.addListener('downloaded', (resFetch: Fetch) => {
				let queue = this.getQueue()
				if (reqID === resFetch.fetchID) {
					queue.set(resFetch.fetchID, resFetch)
					resolve(resFetch)
					logger.info(`[job] ${this.JobName} ${this.id} recieve downloaded ${resFetch.fetchID}`)
				}
			})
		})
	}
	requests(reqs: fetchRequest[]){
		let requests = []
		reqs.forEach(req => {
			requests.push(this.request(req))
		})
		return Promise.all(requests)
	}
	attachEngine(engine: Engine.Engine){
		this.engine = engine
		this.engine.emit('attach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} attach engine`)
	}
	detachEngine(){
		this.engine.emit('detach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} detach engine`)
	}
	// TODO: use()
	abstract async run()
}