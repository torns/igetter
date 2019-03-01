import { queue, AsyncQueue } from 'async'
import * as EventEmitter  from 'events'
import { Engine } from 'Engine/Engine'
import Fetch from 'Fetcher/Fetch'
import { downloader as logger } from 'utils/logger'
import resolveFetch from './resolveFetch'


export default class DownLoader extends EventEmitter{
	private engine: Engine
	private queue: AsyncQueue<Fetch>
	constructor(){
		super()
		this.init()
		this.regHandle()
	}
	/**
	 * 下载器初始化，初始下载队列
	 */
	init(){
		this.queue = queue((fetch: Fetch, cb: CallableFunction) => { // async 异步下载队列 限制并发请求
			resolveFetch(fetch, cb)
		}, 10)
		logger.info(`[downloader] init download queue.`)
	}
	/**
	 * 注册fetch事件
	 */
	regHandle(){
		this.addListener('fetch', (fetch: Fetch) => {
			logger.info(`[downloader] recieve Engine [fetch] ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}.`)
			let action = this.queue.push
			// if (this.isRequesting(fetch.fetcherID)) { // 当Job正在运行时,优先处理其剩余请求
			// 	action = this.queue.unshift
			// }
			action(fetch, (res: fetchResponse) => {
				logger.info(`[downloader] downloaded fetch ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}`)
				this.returnFetch(fetch, res)
			})
		})
	}
	// isRequesting(fetcherID: string): boolean{
	// 	let activeJob = this.engine.getActiveJob()
	// 	return activeJob.has(fetcherID)
	// }
	/**
	 * 将已请求的fetch返回Engine
	 */
	returnFetch(fetch: Fetch, res: fetchResponse){
		fetch.response = res
		this.engine.emit('downloaded', fetch)
	}
	/**
	 * 连接Engine
	 */
	attachEngine(engine: Engine){
		this.engine = engine
		this.engine.emit('attach', this)
	}
}