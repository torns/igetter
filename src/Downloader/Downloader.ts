import { queue, AsyncQueue } from 'async'
import * as EventEmitter  from 'events'
import Engine from '../Engine/Engine'
import Fetch from '../Fetcher/Fetch'
import { downloader as logger } from '../utils/logger'
import createRequest from './RequestBuilder'
import createRespone from './ResponseBuilder'
import createError from './ErrorBuilder';

export default class DownLoader extends EventEmitter{
	private engine: Engine
	private queue: AsyncQueue<Fetch>
	constructor(){
		super()
		this.init()
		this.regHandle()
	}
	/**
	 * init download queue
	 */
	private init(){
		// TODO: support priority queue
		this.queue = queue((fetch: Fetch, cb: CallableFunction) => { // async 异步下载队列 限制并发请求
			let request = createRequest(fetch.request)
			this.engine.hooks.fetching.call(request)
			request
				.then((res) => {
					createRespone(res, fetch.response)
					cb()
				})
				.catch(err => {
					debugger
					fetch.error = {} as fetchError
					createError(err, fetch.error)
					cb()
				})
		}, 10)
		logger.info(`[downloader] init download queue.`)
	}
	/**
	 * register event
	 */
	private regHandle(){
		this.addListener('fetch', (fetch: Fetch) => {
			logger.info(`[downloader] recieve Engine [fetch] ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}.`)
			let action = this.queue.push
			action(fetch, () => {
				logger.info(`[downloader] downloaded fetch ${fetch.fetchID} ${fetch.request.method} ${fetch.request.url}`)
				this.returnFetch(fetch)
			})
		})
	}
	/**
	 * emit downloaded fetch to engine
	 */
	private returnFetch(fetch: Fetch){
		this.engine.emit('downloaded', fetch)
	}
	/**
	 * atach Engine
	 */
	attachEngine(engine: Engine){
		this.engine = engine
		this.engine.emit('attach', this)
	}
}