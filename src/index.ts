import {Engine} from 'Engine/Engine'
import Job from 'Job/Job'
import { URL } from 'url'
import DownLoader from 'Downloader/Downloader';

class bilibili extends Job{
	constructor(){
		super()
	}
	async run(){
		let res = await this.request({
			url: new URL('https://bilibili.com')
		})
		console.log(`bilibili stop`)
	}
}
class larendorr extends Job{
	constructor(){
		super()
	}
	async run(){
		let res = await this.request({
			url: new URL('https://blog.larendorr.cn')
		})
		console.log('v2ex stop')
	}
}
debugger
let e = new Engine()
// e.addJob(bilibili)
e.addJob(larendorr)
let d = new DownLoader()
d.attachEngine(e)
e.run()