import createRequest from '../../src/Downloader/RequestBuilder'
import * as request from 'superagent'
import {
	OutgoingHttpHeaders,
	IncomingHttpHeaders
} from 'http'

interface fetchRequest {
		method ? : string, 
		url: string,
		headers ? : OutgoingHttpHeaders,
		query ? : object,
		data ? : any,
		retry ? : number,
		timeout ? : number,
		redirects?: number, 
		_request ? : any
	}
jest.mock('superagent')
describe('test request builder', () => {
	let fetchRequest: fetchRequest = {
		method: 'get',
		url: 'http://localhost',
		headers: {
			'test-header': 'test'
		},
		query: {
			test: 'test'
		},
		data: {
			test: 'test'
		},
		retry: 2,
		timeout: 5000,
		redirects: 2,
		_request: undefined
	}
	test('create request method and url', () => {
		request = jest.fn()
		let req = createRequest(fetchRequest)
		expect(request).toBeCalledTimes(1)
		expect(request).toBeCalledWith(fetchRequest.method, fetchRequest.url)
	})
	test('create request headers', () => {
		let req = createRequest(fetchRequest)
		req.set = jest.fn()
		expect(req.set).toBeCalledTimes(1)
		expect(req.set).toBeCalledWith(fetchRequest.headers)
	})
})