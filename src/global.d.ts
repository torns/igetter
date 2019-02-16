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
	interface fetch {
		fetcherID: string, // 负责该请求的 fetcher UUID
		fetchID: string, // UUID 该请求的唯一标识
		status: fetchStatus,
		startTime: number, // 请求开始时间
		endTime: number, // 返回时间
		request: { // 请求信息
			method ? : string, // 请求方法
			url: URL, // 地址
			headers ? : OutgoingHttpHeaders, // 请求头
			query ? : object, // 参数
			data ? : object // 数据
			retry ? : number, // 失败尝试次数
			timeout ? : number // 超时
		},
		response ? : {
			status: number,
			body: any, // 返回body
			headers: IncomingHttpHeaders // 返回的头部
		}
	}
	type fetchRequest = fetch['request']
	type fetchResponse = fetch['response']
	interface jobInfo{
		job: any,
		lastRun: number
	}
}