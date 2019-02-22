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
		logger.info(`Job start`)
		await this.run()
		logger.info(`Job end`)
		this.detachEngine()
	}
	request(req: fetchRequest){
		logger.info(`Job request ${req.method} ${req.url}`)
		let reqID = this.push(req)
		return new Promise<Fetch>((resolve, reject) => {
			this.addListener('downloaded', (resFetch: Fetch) => {
				let queue = this.getQueue()
				if (reqID === resFetch.fetchID) {
					queue.set(resFetch.fetchID, resFetch)
					resolve(resFetch)
					logger.info(`job recieve downloaded ${resFetch.fetchID}`)
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
		logger.info(`Job request attach engine`)
	}
	detachEngine(){
		this.engine.emit('detach', this)
		logger.info(`Job request detach engine`)
	}
	// TODO: use()
	abstract async run()
}