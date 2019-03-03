import { Engine } from 'Engine/Engine'
import Job from 'Job/Job'
import DownLoader from 'Downloader/Downloader'
import Extension from 'Extension/Extension'

export {
	Engine,
	Job,
	DownLoader,
	Extension
}

function isToday(date) {
	let todayString = new Date('2019-3-1').toDateString()
	let dateString = date.toDateString()
	return todayString === dateString
}
class getHeaders extends Extension{
	apply(hooks){
		hooks.beforeFetch.tap('get-headers', (fetch) => {
			console.log(fetch.request.headers)
		})
	}
}
class steamcn extends Job{
	public minInterval = 10
	public JobName = 'SteamCN 每日新闻汇总'
	public key = 'v0.1'
	constructor(){
		super()
	}
	async run(){
		let $ = this.$
		let hotPages = await this.request({
			url: 'https://steamcn.com/f161-1' // 热点聚焦板块
		})
		let pageInfo = {
			date: new Date,
			title: '',
			url: ''
		}
		let lists = $('tbody', hotPages.response.body) // 帖子列表
		lists.each(function(i, list){
			let date: Date, title: string, url: string
			let tr = $('tr', this)
			let dateSpan = tr.children('.by-author').children('em').children('span') // 帖子日期
			if (dateSpan.length) { // 最近的时间才有span元素
				date = new Date(dateSpan.attr('title'))
				title = $('.new>a.xst', tr).text()
				url = $('.new>a.xst', tr).attr('href')
				let reg = new RegExp(/.?新闻汇总./)
				if (isToday(date) && reg.test(title)) { // 帖子日期为今日且标题含'新闻汇总'
					pageInfo.date = date
					pageInfo.title = title
					pageInfo.url = 'https://steamcn.com/' + url
					return false
				}
			}
		})
		if (pageInfo.url) {
			return false
		}
		return false
	}
	async save(res){
		console.log(res)
		let store = this.store
		let last = await store.getLast()
		if (last === null || last.url !== res.url) {
			await store.setLast(res)
		}
	}
	// async willRun(){
	// 	let store = this.store
	// 	let res = await store.getLast()
	// 	if (res && isToday(res.date)) {
	// 		return false
	// 	} else {
	// 		return true
	// 	}
	// }
}
class steamcnMulti extends Job{
	public minInterval = 10
	public JobName = 'SteamCN 每日新闻汇总'
	public key = 'v0.2'
	constructor(){
		super()
	}
	async run(){
		let pagesUrl = [
			'https://steamcn.com/t469378-1-1',
			'https://steamcn.com/t468824-1-1',
			'https://steamcn.com/t469084-1-1',
			'https://steamcn.com/t467051-1-1'
		]
		let pagesFetch = pagesUrl.map(url => {
			return {
				url: url
			}
		})
		let res = await this.requests(pagesFetch, (resFetch) => {
			console.log(resFetch.status)
		})
		return false
	}
	async save(res){
		
	}
	async willRun(){
		return true
	}
}
let e = new Engine()
e.use(new getHeaders)
e.addJob(new steamcn())
let d = new DownLoader()
d.attachEngine(e)
e.run()