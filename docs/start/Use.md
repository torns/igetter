
# 面向IGeter使用者

IGetter的使用是非常简单的，例子如下：

```ts
import { Engine, Downloader} from 'igetter'
import Steamcn form './igetter-job-steamcn'

let E = new Engine() // 构造Engine实例
let D = new Downloader() // 构造Downloader实例

D.attachEngine(E) // Downloader连接至Engine

E.addJob(new Steamcn()) // 添加任务

E.run() // IGetter开始运行

E.listen((data) => {
	// 消费爬取到的数据
})
```

# 面向Job编写者

Job的编写、维护是非常耗时耗力的。因为网站的样式都不一样，信息的获取是非常繁琐的。这也是急需大家贡献力量的地方。

如果你有什么想法或者已经编写好的 Job，请向//TODO提出 Issue 或者 Pull Request 

下面我来举一个 Job 的例子：

作者平时喜欢浏览[SteamCN](https://steamcn.com/)论坛。在其中的热点聚焦板块，每天会有当日的游戏**新闻汇总**。我们就来写一个 Job，目的就是当**每日新闻汇总**发出来时，通知我们。

```ts
import { Job } from 'igetter'

class steamcn extends Job{ // 继承Job类
  public JobName = 'SteamCN 每日新闻汇总' // Job名称 

  public euqalDate(date?: Date) { // 简单的方法类，用来判断日期是否相等
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
      date: new Date(), // 帖子日期
      title: '', // 帖子标题
      url: '' // 帖子地址
    }
    let that = this
    let lists = $('tbody', hotPages.response.body) // 帖子列表
    lists.each(function(i, list) {
      let date: Date, title: string, url: string
      let tr = $('tr', this)
      let dateSpan = tr.children('.by-author').children('em').children('span') // 每个帖子的发表日期
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
    if (pageInfo.url) { // 本次执行获取到信息时，返回进行存储
      return pageInfo
    }
    return false
  }
}
```






# 面向Plugin编写者

