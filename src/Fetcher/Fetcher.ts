import * as EventEmitter  from 'events'
import * as uuid from 'uuid/v1'
import * as deepmerge from 'deepmerge'
import Engine = require('Engine/Engine')
import { fetcher as logger } from 'utils/logger';

// TODO: random UA
const DEFAULT = {
	request: {
		method: 'GET',
		headers:{
			'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
		}
	}
}

export default class Fetcher extends EventEmitter{
	public id: string // 每个Fetcher 的 ID
	private queue: fetch[] = [] // 存放请求信息
	public engine: Engine.Engine // 引用连接的调度引擎
	constructor(){
		super()
		this.id = uuid()
	}
	push(req: fetchRequest){
		logger.info(`Fetcher recieve job request ${req.method || 'GET'} ${req.url}`)
		let fetch:fetch = this.createFetch(req)
		this.queue.push(fetch)
		if (this.engine) {
			this.engine.emit('fetch', fetch)
			logger.info(`Fetch send fetch to Engine ${fetch.request.method} ${fetch.request.url}`)
		}
	}
	createFetch(options:fetchRequest): fetch{
		let fetch = {} as fetch
		fetch.fetcherID = this.id
		fetch.fetchID = uuid()
		fetch.status = fetchStatus.wait
		fetch.startTime = Date.now()
		fetch.endTime = NaN
		fetch.request = {
			...DEFAULT.request,
			...options,
			headers:{
				...DEFAULT.request.headers,
				...options.headers
			}
		}
		return fetch
	}
	
}