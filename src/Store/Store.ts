import * as DataStore from 'nedb'
import { promisify } from 'util'
import { store as logger } from 'utils/logger'

async function to(p: Promise<any>){ // 将await promise 结果转化成 [error, data] 形式, 方便书写
	return p.then(data => [null, data]).catch(err => [err, null])
}
function wrap(fn: Function) { // 工具函数, 将db回调函数形式转换为async/await形式
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
	connect() { // 创建 DataStore
		this.db = new DataStore({
			filename: this.path
		})
		this.db.loadDatabase(error => {
			if (error)
				logger.error(`[job] ID: ${this.id} Error: ${error.message}`)
		})
	}
	disconnect(){ // 释放 DataStore
		delete this.db
	}
	async insert(doc: any){ // 插入
		return wrap(this.db.insert.bind(this.db))(doc)
	}
	async find(query: any){ // 查找
		return wrap(this.db.find.bind(this.db))(query)
	}
	async findOne(query: any){
		return wrap(this.db.findOne.bind(this.db))(query)
	}
	async count(query: any){ // 计数
		return wrap(this.db.count.bind(this.db))(query)
	}
	async update(query: any, update: any, options?: DataStore.UpdateOptions){ // 更新
		return wrap(this.db.update.bind(this.db))(query, update, options)
	}
	async remove(query: any, options?: DataStore.RemoveOptions){ // 删除
		return wrap(this.db.remove.bind(this.db))(query, options)
	}
	async getLast(){ // 获取上一次存储内容
		return await this.findOne({_isLast: true})
	}
	async setLast(doc: any){
		debugger
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
	}
	async getAll(){
		return await this.find({})
	}

}