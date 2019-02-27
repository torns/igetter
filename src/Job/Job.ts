import Engine = require('Engine/Engine')
import Fetcher from 'Fetcher/Fetcher'
import { job as logger } from 'utils/logger'
import md5 = require('blueimp-md5')
import Store from 'Store/Store'

// TODO: once job
// TODO: date support
export default abstract class Job extends Fetcher{
	public active: boolean = false // 标记任务是否正在执行
	public minInterval: number = 10  // 最小执行间隔(分钟)
	public JobName: string = 'Job' // 任务名称
	public abstract key:string // 生成id的盐值
	public store: Store
	constructor(){
		super()
	}
	async _run(engine: Engine.Engine){
		debugger
		this.attachEngine(engine) // 连接至引擎
		logger.debug(`[job] ${this.JobName} ${this.id} start`)
		let res = await this.run()
		await this._save(res)
		logger.debug(`[job] ${this.JobName} ${this.id} end`)
		this.detachEngine()
	}
	async _save(res){
		this.store = new Store(this.id)
		this.store.connect() // 连接数据文件
		await this.save(res)
		this.store.disconnect() // 释放连接
	}
	setID(){
		this.id =  md5(this.JobName, this.key) // key + class.name 生成md5
	}
	attachEngine(engine: Engine.Engine){ // 连接至引擎
		this.engine = engine
		this.engine.emit('attach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} attach engine`)
	}
	detachEngine(){ // 释放
		this.engine.emit('detach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} detach engine`)
	}
	// TODO: use()
	abstract async run() // TODO:返回值
	abstract async save(res)
}