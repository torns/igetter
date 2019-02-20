import Engine = require('Engine/Engine')
import Fetcher from 'Fetcher/Fetcher'
import { job as logger } from 'utils/logger';

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
	request(req: fetch['request']){
		logger.info(`Job request ${req.method} ${req.url}`)
		this.push(req)
		return new Promise((resolve, reject) => {
			this.addListener('downloaded', res => {
				resolve(res)
			})
		})
	}
	attachEngine(engine: Engine.Engine){
		logger.info(`Job request attach engine`)
		this.engine = engine
		this.engine.emit('attach', this)
	}
	detachEngine(){
		logger.info(`Job request detach engine`)
		this.engine.emit('detach', this)
	}
	// TODO: use()
	abstract async run()
}