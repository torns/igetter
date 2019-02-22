import * as EventEmitter  from 'events'
import * as uuid from 'uuid/v1'
import * as deepmerge from 'deepmerge'
import Engine = require('Engine/Engine')
import { fetcher as logger, fetcher } from 'utils/logger';
import Fetch from './Fetch';



export default class Fetcher extends EventEmitter{
	public id: string // 每个Fetcher 的 ID
	private queue: Map<string, Fetch> = new Map // 存放请求信息
	public engine: Engine.Engine // 引用连接的调度引擎
	constructor(){
		super()
		this.id = uuid()
		this.setMaxListeners(20)
	}
	push(req: fetchRequest){
		logger.info(`Fetcher recieve job request ${req.method || 'GET'} ${req.url}`)
		let fetch = new Fetch(req)
		fetch.setFetcherID(this.id)
		// let fetch:fetch = this.createFetch(req)
		this.queue.set(fetch.fetchID, fetch)
		if (this.engine) {
			this.engine.emit('fetch', fetch)
			logger.info(`Fetch send fetch to Engine ${fetch.request.method} ${fetch.request.url}`)
		}
		return fetch.fetchID
	}
	getQueue(){
		return this.queue
	}
}