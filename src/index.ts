import {Engine} from 'Engine/Engine'
import Job from 'Job/Job'
import { URL } from 'url'
import DownLoader from 'Downloader/Downloader';

class larendorr extends Job{
	public minInterval = 1
	public JobName = 'Test Job'
	constructor(){
		super()
	}
	async run(){
		let res = await this.request({
			url: new URL('https://blog.larendorr.cn')
		})
	}
}
debugger
let e = new Engine()
e.addJob(new larendorr())
e.addJob(new larendorr())
let d = new DownLoader()
d.attachEngine(e)
e.run()