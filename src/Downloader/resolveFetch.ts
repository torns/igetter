import * as request from 'superagent'

export default function resolveFetch(fetch: fetch, cb){
	let fetchRequest = fetch.request
	let method = fetchRequest.method
	let url = fetchRequest.url.toString()
	let req = request(method, url)
	req.then(res => {
		let response = {} as fetchResponse
		response.status = res.status
		response.body = res.body || res.text
		response.headers = res.header
		cb(response)
	})
}