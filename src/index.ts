import {Engine} from 'Engine/Engine'
import Job from 'Job/Job'
import { URL } from 'url'
import DownLoader from 'Downloader/Downloader';
import * as $ from 'cheerio'
function isToday(date: Date){
		let todayString = new Date('2019-2-21').toDateString()
		let dateString = date.toDateString()
		return todayString === dateString
	}
class steamcn extends Job{
	public minInterval = 10
	public JobName = 'SteamCN 每日新闻汇总'
	constructor(){
		super()
	}
	async run(){
		// let hotPages = await this.request({
		// 	url: new URL('https://steamcn.com/f161-1') // 热点聚焦板块
		// })
		// console.log(hotPages.endTime - hotPages.startTime)
		// debugger
		// let pageInfo = {
		// 	date: new Date,
		// 	title: '',
		// 	url: ''
		// }
		// let lists = $('tbody', hotPages.response.body) // 帖子列表
		// lists.each(function(i, list){
		// 	let date: Date, title: string, url: string
		// 	let tr = $('tr', this)
		// 	let dateSpan = tr.children('.by-author').children('em').children('span') // 帖子日期
		// 	if (dateSpan.length) { // 最近的时间才有span元素
		// 		date = new Date(dateSpan.attr('title'))
		// 		title = $('.new>a.xst', tr).text()
		// 		url = $('.new>a.xst', tr).attr('href')
		// 		let reg = new RegExp(/.?新闻汇总./)
		// 		if (isToday(date) && reg.test(title)) { // 帖子日期为今日且标题含'新闻汇总'
		// 			pageInfo.date = date
		// 			pageInfo.title = title
		// 			pageInfo.url = 'https://steamcn.com/' + url
		// 			return false
		// 		}
		// 	}
		// })
		// console.log(pageInfo.date, pageInfo.title, pageInfo.url)
		let links = ['https://steamcn.com/t465610-1-1', 'https://steamcn.com/t461904-1-1', 'https://steamcn.com/t466300-1-1', 'https://steamcn.com/t467147-1-1', 'https://steamcn.com/t330849-1-1']
		let fetchs: fetchRequest[] = []
		links.forEach(link => {
			fetchs.push({
				url: new URL(link)
			})
		})
		debugger
		let d = Date.now()
		let res = await this.requests(fetchs)
		debugger
		res.forEach(fetch => {
			console.log(fetch.status)
		})
	}
}
debugger
let e = new Engine()
e.addJob(new steamcn())
let d = new DownLoader()
d.attachEngine(e)
e.run()