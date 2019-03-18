import Engine from './Engine/Engine'
import Job from './Job/Job'
import DownLoader from './Downloader/Downloader'
import Plugin from './Plugin/Plugin'


class getHeaders extends Plugin{
  public PluginName = 'Get Fetch Headers'
  public majorVer = '1'
  public minorVer = '1'
  public apply(hooks: Hooks) {
    hooks.beforeFetch.tap('get-headers', (fetch) => {
      console.log(fetch.request.headers)
    })
  }
}
class steamcn extends Job{
  public minInterval = 10
  public JobName = 'SteamCN 每日新闻汇总'
  public majorVer = '0'
  public minorVer = '1'
  public constructor() {
    super()
  }
  public euqalDate(date?: Date) {
    if (!date) {
      date = new Date()
    }
    let todayString = date.toDateString()
    let dateString = date.toDateString()
    return todayString === dateString
  }
  public async run() {
    let $ = this.$
    let hotPages = await this.request({
      url: 'https://steamcn.com/f161-1' // 热点聚焦板块
    })
    let pageInfo = {
      date: new Date(),
      title: '',
      url: ''
    }
    let that = this
    let lists = $('tbody', hotPages.response.body) // 帖子列表
    lists.each(function(i, list) {
      let date: Date, title: string, url: string
      let tr = $('tr', this)
      let dateSpan = tr.children('.by-author').children('em').children('span') // 帖子日期
      if (dateSpan.length) { // 最近的时间才有span元素
        date = new Date(dateSpan.attr('title'))
        title = $('.new>a.xst', tr).text()
        url = $('.new>a.xst', tr).attr('href')
        let reg = new RegExp(/.?新闻汇总./)
        if (that.euqalDate() && reg.test(title)) { // 帖子日期为今日且标题含'新闻汇总'
          pageInfo.date = date
          pageInfo.title = title
          pageInfo.url = 'https://steamcn.com/' + url
          return false
        }
      }
    })
    if (pageInfo.url) {
      return pageInfo
    }
    return false
  }
}
let e = new Engine({
  concurrency: 5
})
let d = new DownLoader()
d.attachEngine(e)

e.addJob(new steamcn())
e.listen((data) => {
  console.log(data)
})


export default e

class test extends Job{
  public JobName = 'TESTTESTTEST'
  public majorVer = '0'
  public minorVer = '1'
  public url: string
  public constructor(url: string) {
    super()
    this.JobName += url
    this.url = url
  }
  public async run() {
    let req: fetchRequest = {
      url: this.url
    }
    let res = await this.request(req)
    if (res.error) {
      console.log('--------------error-------------')
    } else {
      console.log(`-------------${res.response.status}---------`)
    }
    return false
  }
}
let urls = [
  'https://juejin.im/search?query=Web%E5%AD%98%E5%82%A8&type',
  'https://www.nowcoder.com/ta/front-end-interview?query=&asc=true&order=&page=2',
  'https://juejin.im/book/5bdc715fe51d454e755f75ef',
  'https://github.com/LarenDorr?tab=stars',
  'https://segmentfault.com/a/1190000007926921',
  'https://segmentfault.com/a/1190000005927232',
  'https://eplover.github.io/pages/2017/04/06/cso.html',
  'https://www.imooc.com/article/16746',
  'https://www.douyu.com/6504457',
  'https://juejin.im/search?query=Web%E5%AD%98%E5%82%A8&type',
  'https://www.nowcoder.com/ta/front-end-interview?query=&asc=true&order=&page=2',
  'https://juejin.im/book/5bdc715fe51d454e755f75ef',
  'https://github.com/LarenDorr?tab=stars'
]
urls.forEach(url => {
  e.addJob(new test(url))
})
// e.addJob(new v2ex())
// e.addJob(new bilibili('王老菊',423895))
// e.addJob(new javascriptWeek())
// class bilibili extends Job{
// 	public majorVer = '0'
// 	public minorVer = '1'
// 	private upID: number
// 	constructor(name: string, id: number){
// 		super()
// 		this.JobName = `哔哩哔哩UP主${name}更新`
// 		this.upID = id
// 	}
// 	async run(){
// 		let spaceURL = `https://spaces.bilibili.com/ajax/member/getSubmitVideos`
// 		let spaceFetch = {} as fetchRequest
// 		spaceFetch.url = spaceURL
// 		spaceFetch.query = {
// 			'mid': this.upID
// 		}
// 		let spaceRes = await this.request(spaceFetch)
// 		if (spaceRes.error) {
// 			console.log(spaceRes.error.message)
// 			return
// 		}
// 		let videoList = spaceRes.response.body
// 		let newVideo = videoList.data.vlist[0]
// 		let res = {
// 			author: newVideo.author,
// 			date: new Date(newVideo.created * 1000),
// 			title: newVideo.title
// 		}
// 		console.log(res)
// 	}
// 	async save(res){

// 	}
// }
// class v2ex extends Job{
// 	public JobName = 'v2ex'
// 	public majorVer = '0'
// 	public minorVer = '1'
// 	async run(){
// 		let url = 'https://www.v2ex.com/t/12312312312312'
// 		let res = await this.request({
// 			url: url
// 		})
// 		if (res.error) {
// 			console.log(res.error.message)
// 		}
// 	}
// 	async save(res){

// 	}
// }
