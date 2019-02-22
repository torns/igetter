import {
	URL
} from "url"
import {
	OutgoingHttpHeaders,
	IncomingHttpHeaders
} from "http"
import Job from "Job/Job"

declare global {
	const enum fetchStatus {
		wait = 'WAIT', // 等待请求发送
		request = 'REQUEST', // 请求发送等待响应
		success = 'SUCCESS', // 成功得到响应
		faile = 'FAILE' // 超时或网络传输出问题
	}
	interface fetchRequest { // 请求信息
			method ? : string, // 请求方法
			url: URL | string, // 地址
			headers ? : OutgoingHttpHeaders, // 请求头
			query ? : object, // 参数
			data ? : object, // 数据
			retry ? : number, // 失败尝试次数
			timeout ? : number, // 超时
			_request?: any // 引用实际的request
		}
	interface fetchResponse {
			status: number,
			body: any, // 返回body
			headers: IncomingHttpHeaders // 返回的头部
			_response?: any // 引用实际的响应 
		}
	interface jobInfo{
		job: Job,
		lastRun: number,
		startTime: number,
		endTime: number
	}
}