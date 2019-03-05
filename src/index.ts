import Engine from './Engine/Engine'
import {
	OutgoingHttpHeaders,
	IncomingHttpHeaders
} from 'http'
import { SyncHook } from 'tapable'
import Job from './Job/Job'
import DownLoader from './Downloader/Downloader'
import Plugin from './Plugin/Plugin'
require('easy-monitor')('IGetter')
export {
	Engine,
	Job,
	DownLoader,
	Plugin
}

declare global {
	const enum fetchStatus {
		wait = 'WAIT', // wait fetch request
		request = 'REQUEST', // wait result after requested
		success = 'SUCCESS', // get result
		faile = 'FAILE' // request failed
	}
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
	interface fetchResponse {
		status: number,
		body: any,
		headers: IncomingHttpHeaders
		_response ? : any
	}
	interface fetchError {
		message: string,
		status: number | string,
		response: any,
		_error: any
	}
	interface jobInfo {
		job: Job,
		lastRun: number,
		startTime: number,
		endTime: number
	}
	interface Hooks{
		beforeFetch: SyncHook,
		fetching: SyncHook,
		afterFetch: SyncHook
	}
}

import test from './test'

test.run()

