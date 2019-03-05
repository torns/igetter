import * as $ from 'cheerio'
import Fetcher from '../Fetcher/Fetcher'
import { job as logger } from '../utils/logger'
import md5 = require('blueimp-md5')
import Store from '../Store/Store'
import Engine from '../Engine/Engine';

/**
 * job
 */
export default abstract class Job extends Fetcher{
	public isActive: boolean = false // job whether run
	public minInterval: number = 10  // min run interval (s)
	public JobName: string = 'Job' // job name
	public abstract majorVer: string // job majorVer, decide store files name
	public abstract minorVer: string // job minorVer
	public $ = $ // analyze lib
	public store: Store
	constructor(){
		super()
	}
	/**
	 * start job, include attach engine, run user script, save store, detach engine
	 * NOT CALL
	 */
	 async _run(engine: Engine){
		this.attachEngine(engine)
		logger.debug(`[job] ${this.JobName} ${this.id} start`)
		let res = await this.run()
		if (res) {
			await this._save(res)	
		}
		logger.debug(`[job] ${this.JobName} ${this.id} end`)
		this.detachEngine()
	}
	/**
	 * save store form job run
	 * NOT CALL
	 */
	async _save(res){
		await this.save(res)
		// this.store.disconnect() // TODO: 重构store初始顺序
	}
	active(){
		this.store = new Store(this.id)
		this.store.connect()
		this.isActive = true
	}
	inactive(){
		delete this.store
		this.isActive = false
	}
	/**
	 * set job id
	 */
	setID(){
		this.id =  md5(this.JobName, this.majorVer) // key + class.name 生成md5
	}
	// /**
	//  * init store 
	//  */
	// initStore(){
	// 	this.store = new Store(this.id)
	// 	this.store.connect()
	// }
	/**
	 * attach engine
	 */
	attachEngine(engine: Engine){
		this.engine = engine
		this.engine.emit('attach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} attach engine`)
	}
	/**
	 * detach engine
	 */
	detachEngine(){
		this.engine.emit('detach', this)
		logger.debug(`[job] ${this.JobName} ${this.id} detach engine`)
	}
	/**
	 * request url, resolve response, return result
	 */
	abstract async run(): Promise<any>
	/**
	 * save job run result
	 */
	abstract async save(res: any): Promise<any>
	/**
	 * whether push to wait job queue
	 */
	async willRun(){
		return Promise.resolve(true)
	}
}