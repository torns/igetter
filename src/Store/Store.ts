import * as DataStore from 'nedb'
import { promisify } from 'util'
import { store as logger } from 'utils/logger'

/**
 * 将await promise 结果转化成 [error, data] 形式, 方便书写
 */
async function to(p: Promise<any>){
	return p.then(data => [null, data]).catch(err => [err, null])
}
/**
 * 工具函数, 将NeDB回调函数形式转换为async/await形式
 */
function wrap(fn: Function) {
	return async function(...args) {
		let p = promisify(fn)(...args)
		let [err, res] = await to(p)
		if (err) {
			logger.error(err)
			return err
		}
		return res
	}
}

export default class Store {
	private db: DataStore // NeDB 实例
	private path: string // 数据文件路径
	private id: string // Job id
	constructor(id: string){
		this.id = id
		let path = `./data/${id}.json`
		this.path = path
	}
	/**
	 * 实例化Store
	 */
	connect() {
		this.db = new DataStore({
			filename: this.path
		})
		this.db.loadDatabase(error => {
			if (error)
				logger.error(`[job] ID: ${this.id} Error: ${error.message}.`)
			else 
				logger.info(`[job] ID: ${this.id} connected Store.`)
		})
	}
	/**
	 * 释放Store实例
	 */
	disconnect(){
		delete this.db
		logger.debug(`[job] ID: ${this} disconnected Store.`)
	}
	/**
	 * 插入数据
	 */
	async insert(doc: any){
		let res = wrap(this.db.insert.bind(this.db))(doc)
		logger.debug(`[job] ID: ${this} Store insert ${doc}`)
		return res
	}
	/**
	 * 查找数据
	 */
	async find(query: any){
		return wrap(this.db.find.bind(this.db))(query)
	}
	/**
	 * 查找数据，仅返回一个结果
	 */
	async findOne(query: any){
		return wrap(this.db.findOne.bind(this.db))(query)
	}
	/**
	 * 计数
	 */
	async count(query: any){
		return wrap(this.db.count.bind(this.db))(query)
	}
	/**
	 * 更新数据
	 */
	async update(query: any, update: any, options?: DataStore.UpdateOptions){ // 更新
		let res = wrap(this.db.update.bind(this.db))(query, update, options)
		logger.debug(`[job] ID: ${this} update ${res}`)
		return res
	}
	/**
	 * 删除数据
	 */
	async remove(query: any, options?: DataStore.RemoveOptions){ // 删除
		let res = wrap(this.db.remove.bind(this.db))(query, options)
		logger.debug(`[job] ID: ${this} remove ${res}`)
		return res
	}
	/**
	 * 获取上一次存储内容
	 */
	async getLast(){
		return await this.findOne({_isLast: true})
	}
	/**
	 * 存储最新数据
	 */
	async setLast(doc: any){
		let lastID = (await this.getLast())
		if (lastID !== null) {
			lastID = lastID._id
		} else {
			lastID = null
		}
		await this.update({_isLast: true}, { $set: {_isLast: false}}, {})
		doc.prev = lastID
		doc._isLast = true
		await this.insert(doc)
		logger.debug(`[job] ID: ${this} Store setLast.`)
	}
	/**
	 * 获取全部数据
	 */
	async getAll(){
		return await this.find({})
	}

}