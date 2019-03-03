import * as $ from 'cheerio'
import Engine = require('Engine/Engine')
import Fetcher from 'Fetcher/Fetcher'
import { job as logger } from 'utils/logger'
import md5 = require('blueimp-md5')
import Store from 'Store/Store'

export default abstract class Job extends Fetcher{
	public active: boolean = false // 标记任务是否正在执行
	public minInterval: number = 10  // 最小执行间隔(分钟)
	public JobName: string = 'Job' // 任务名称
	public abstract key:string // 生成id的盐值
	public $ = $ // 解析库
	public store: Store
	constructor(){
		super()
	}
	/**
	 * 运行任务，包括连接引擎，执行用户run函数，释放
	 */
	 async _run(engine: Engine.Engine){
		this.attachEngine(engine)
		logger.debug(`[job] ${this.JobName} ${this.id} start`)
		let res = await this.run()
		debugger
		if (res) {
			await this._save(res)	
		}
		logger.debug(`[job] ${this.JobName} ${this.id} end`)
		this.detachEngine()
	}
	/**
	 * 存储任务返回的数据
	 */
	async _save(res){
		await this.save(res)
		// this.store.disconnect() // TODO: 释放连接
	}
	/**
	 * 设置任务ID
	 */
	setID(){
		this.id =  md5(this.JobName, this.key) // key + class.name 生成md5
		this.initStore()
	}
	/**
	 * 初始化store
	 */
	initStore(){
		this.store = new Store(this.id)
		this.store.connect()
	}
	/**
	 * 连接至Engine
	 */
	attachEngine(engine: Engine.Engine){ // 连接至引擎
		this.engine = engine
		this.engine.emit('attach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} attach engine`)
	}
	/**
	 * 从引擎释放
	 */
	detachEngine(){ // 释放
		this.engine.emit('detach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} detach engine`)
	}
	/**
	 * 发出请求，解析响应
	 */
	abstract async run(): Promise<any>
	/**
	 * 保存数据
	 */
	abstract async save(res: any): Promise<any>
	/**
	 * 是否推入待执行任务队列
	 */
	async willRun(){
		return Promise.resolve(true)
	}
}