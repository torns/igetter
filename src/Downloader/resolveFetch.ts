import * as request from 'superagent'
import Fetch from 'Fetcher/Fetch'
import { downloader as logger } from 'utils/logger'

export default function resolveFetch(fetch: Fetch, cb: CallableFunction){
	let fetchRequest = fetch.request
	let method = fetchRequest.method
	let url = fetchRequest.url.toString()
	fetch.status = fetchStatus.request
	let req = request(method, url)
	req.then(res => {
		fetch.status = fetchStatus.success
		fetch.endTime = Date.now()
		let response = {} as fetchResponse
		response.status = res.status
		response.body = res.text
		response.headers = res.header
		cb(response)
	}).catch((error: Error) => {
		logger.error(error.message)
		let response = {} as fetchResponse
		fetch.status = fetchStatus.faile
		cb(response)
	})
}