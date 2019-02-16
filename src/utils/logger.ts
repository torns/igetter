import { configure, getLogger } from 'log4js'

configure({
	appenders: {
		out: {
			type: 'stdout'
		},
		file: {
			type: 'file',
			filename: 'log.log'
		}
	},
	categories:{
		default:{
			appenders: ['out'],
			level: 'debug'
		},
		engine: {
			appenders: ['out'],
			level: 'debug'
		},
		job: {
			appenders: ['out'],
			level: 'error'
		},
		fetcher: {
			appenders: ['out'],
			level: 'error'
		},
		downloader: {
			appenders: ['out'],
			level: 'error'
		},
	}
})
export default  getLogger()
export const engine = getLogger('engine')
export const job = getLogger('job')
export const fetcher = getLogger('fetcher')
export const downloader = getLogger('downloader')
