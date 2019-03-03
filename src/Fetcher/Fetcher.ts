import * as EventEmitter  from 'events'
import Engine = require('Engine/Engine')
import { fetcher as logger } from 'utils/logger'
import Fetch from './Fetch'

export default class Fetcher extends EventEmitter{
	public id: string // 每个Fetcher(Job) 的 ID
	private queue: Map<string, Fetch> = new Map // 存放请求信息
	private callBacks: Map<string, Function> = new Map
	public engine: Engine.Engine // 引用连接的调度引擎
	
	constructor(){
		super()
		this.addListener('downloaded', (resFetch: Fetch) => {
			let cb = this.callBacks.get(resFetch.fetchID)
			cb(resFetch)
		})
	}
	/**
	 * 构造fetch，交付给Engine
	 */
	private push(req: fetchRequest): Fetch['fetchID']{
		logger.info(`[Fetcher] ${this.id} recieve job request ${req.method || 'GET'} ${req.url}`)
		let fetch = new Fetch(req)
		fetch.setFetcherID(this.id)
		this.queue.set(fetch.fetchID, fetch)
		if (this.engine) {
			this.engine.emit('fetch', fetch)
			logger.info(`[Fetcher] ${this.id} send fetch to Engine ${fetch.request.method} ${fetch.request.url}`)
		} else {
			logger.error(`Engine not attach!`)
		}
		return fetch.fetchID
	}
	/**
	 * 向回调函数map添加某个fetch的回调
	 */
	private waitDownload(fetchID: Fetch['fetchID'], cb: Function){
		this.callBacks.set(fetchID, cb)
	}
	/**
	 * 发出请求，等待Engine返回结果
	 */
	async request(req: fetchRequest, cb?: Function){
		let fetchID = this.push(req)
		return new Promise<Fetch>((resolve, reject) => {
			this.waitDownload(fetchID, function(resFetch: Fetch){
				if (cb) {
					cb(resFetch)
				}
				resolve(resFetch)
			})
		})
	}
	/**
	 * 请求一组数据,可设置回调处理每个结果,
	 * 也可以等待所有请求统一处理
	 */
	requests(reqs: fetchRequest[], cb?: Function){
		let requests = []
		reqs.forEach(req => {
			requests.push(this.request(req, cb))
		})
		return Promise.all(requests)
	}
	/**
	 * 获得fetcher下请求队列
	 */
	getQueue(){
		return this.queue
	}
	// TODO: support RSS
}