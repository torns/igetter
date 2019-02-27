import * as EventEmitter  from 'events'
import * as uuid from 'uuid/v1'
import * as $ from 'cheerio'
import Engine = require('Engine/Engine')
import { fetcher as logger } from 'utils/logger'
import Fetch from './Fetch'

export default class Fetcher extends EventEmitter{
	public id: string // 每个Fetcher(Job) 的 ID
	private queue: Map<string, Fetch> = new Map // 存放请求信息
	public engine: Engine.Engine // 引用连接的调度引擎
	public $ = $
	constructor(){
		super()
		this.setMaxListeners(20)
	}
	push(req: fetchRequest){
		logger.info(`[Fetcher] ${this.id} recieve job request ${req.method || 'GET'} ${req.url}`)
		let fetch = new Fetch(req)
		fetch.setFetcherID(this.id)
		this.queue.set(fetch.fetchID, fetch)
		if (this.engine) {
			this.engine.emit('fetch', fetch)
			logger.info(`[Fetcher] ${this.id} send fetch to Engine ${fetch.request.method} ${fetch.request.url}`)
		} else {
			logger.error(`Engine not set!`)
		}
		return fetch.fetchID
	}
		request(req: fetchRequest){
		// logger.info(`[job] ${this.JobName} ${this.id} request ${req.method} ${req.url}`)
		let reqID = this.push(req)
		return new Promise<Fetch>((resolve, reject) => {
			this.addListener('downloaded', (resFetch: Fetch) => {
				let queue = this.getQueue()
				if (reqID === resFetch.fetchID) {
					queue.set(resFetch.fetchID, resFetch)
					resolve(resFetch)
					// logger.info(`[job] ${this.JobName} ${this.id} recieve downloaded ${resFetch.fetchID}`)
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
	getQueue(){
		return this.queue
	}
	// TODO: support RSS
}