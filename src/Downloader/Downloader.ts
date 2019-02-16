import * as EventEmitter  from 'events'
import { queue, AsyncQueue } from 'async'
import { Engine } from 'Engine/Engine'
import resolveFetch from './resolveFetch'
import { downloader as logger } from 'utils/logger';

export default class DownLoader extends EventEmitter{
	private engine: Engine
	private queue
	constructor(){
		super()
		this.init()
		this.regHandle()
	}
	init(){
		this.queue = queue((fetch: fetch, cb) => {
			// download
			resolveFetch(fetch, cb)
		}, 10)
		logger.info(`Downloader init download queue`)
	}
	regHandle(){
		this.addListener('fetch', (fetch: fetch) => {
			logger.info(`Downloader recieve Engine fetch: ${fetch.request.method} ${fetch.request.url}`)
			this.queue.push(fetch, (res: fetchResponse) => {
				logger.info(`Downloaded fetch ${fetch.request.method} ${fetch.request.url}: ${res.status}`)
				this.returnFetch(fetch,res)
			})
		})
	}
	returnFetch(fetch: fetch, res: fetchResponse){
		fetch.response = res
		this.engine.emit('downloaded', fetch)
	}
	attachEngine(engine: Engine){
		this.engine = engine
		this.engine.emit('attach', this)
	}
	// TODO: datach
}