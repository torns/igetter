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
		store: {
			appenders: ['out'],
			level: 'debug'
		}
	}
})
export default  getLogger()
export const engine = getLogger('engine')
export const job = getLogger('job')
export const fetcher = getLogger('fetcher')
export const downloader = getLogger('downloader')
export const store = getLogger('store')
