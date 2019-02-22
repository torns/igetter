import * as EventEmitter  from 'events'
import { queue, AsyncQueue } from 'async'
import { Engine } from 'Engine/Engine'
import resolveFetch from './resolveFetch'
import { downloader as logger } from 'utils/logger'
import Fetch from 'Fetcher/Fetch'

export default class DownLoader extends EventEmitter{
	private engine: Engine
	private queue: AsyncQueue<Fetch>
	constructor(){
		super()
		this.init()
		this.regHandle()
	}
	init(){
		this.queue = queue((fetch: Fetch, cb: CallableFunction) => { // async 异步下载队列 限制并发请求
			resolveFetch(fetch, cb)
		}, 10)
		logger.info(`Downloader init download queue.`)
	}
	regHandle(){
		this.addListener('fetch', (fetch: Fetch) => {
			logger.info(`Downloader recieve Engine fetch: ${fetch.request.method} ${fetch.request.url} ID: ${fetch.fetchID}`)
			let action = this.queue.push
			if (this.isRequesting(fetch.fetcherID)) { // 当Job正在运行时,优先处理其剩余请求
				action = this.queue.unshift
			}
			action(fetch, (res: fetchResponse) => {
				logger.info(`Downloaded fetch ${fetch.fetchID}`)
				this.returnFetch(fetch, res)
			})
		})
	}
	isRequesting(fetcherID: string){
		let activeJob = this.engine.getActiveJob()
		return activeJob.has(fetcherID)
	}
	returnFetch(fetch: Fetch, res: fetchResponse){
		fetch.response = res
		this.engine.emit('downloaded', fetch)
	}
	attachEngine(engine: Engine){
		this.engine = engine
		this.engine.emit('attach', this)
	}
}