# Job

Job 是 Job 编写者主要关注的模块。主要作用为发出请求，解析响应。

实现上，Job 继承了一个叫 Fetcher 的类，但对于 Job 编写者来说是 Fetcher 隐藏的。其主要作用就是发出请求。在此就将其 Api 放到 Job 中了。

# 属性

## isActive

Job 是否在被执行。

- **类型**：`Boolean`
- **用法**：
该属性用于内部控制 Job 的运行状态，使用者可忽略。

## minInterval

控制 Job 运行的最小间隔时间。只保证该时间间隔内不会重复执行。

!> 请 Job 编写者注意，当该属性值过小时，会多次短时间内访问目标网站，容易被封禁IP。所以请合理的设置该属性。

- **类型**：`Number`，单位：秒。
- **默认值**：10
- **用法**：
```ts
class MyJob extends Job {
	public minInterval = 20 // 20 秒内只执行一次
	// ...
}
```

## JobName

Job的名称。

!> 在 IGetter 中，每个 Job 都有一个独立的存储空间（文件），其名称即为其ID：`id = md5(this.JobName, this.majorVer)`。所以 JobName 请务必赋值，否则会使用默认值`Job`的存储空间。

- **类型**：`String`
- **默认值**：`'Job'`
- **用法**：
```ts
// 可以编写在构造前声明，所有实例为一个JobName
class MyJob extends Job {
	public JobName = 'MyJob' // Job 名称为 MyJob
	// ...
}
// 构造时确定JobName，例如关注的Bilibili Up主更新，不同的Up主有不同的 JobName
class Bilibili extends Job {
	private UpID: number
	constructor(name: string, id: number) {
		super()
		this.JobName = `哔哩哔哩UP主 ${name} 更新`
		this.UpID = id
	}
}
```

## majorVer



- **类型**：
- **用法**：
```ts

```



# 方法

## run()

Job 每次执行的函数体。在这里编写 Job 的主要逻辑。该函数返回的**非`fasle`值**将会被 Engine 交由 Store 存储至该 Job 对应的存储文件中。

- **参数**：无
- **返回类型**：any
- **用法**：

```ts
class MyJob extends Job{
 // ... Job 必要的属性
 async run() {
	 // ... 请求、解析数据, 参照sample //TODO
	 return {
		 data: 'job got data'
	 }
 }
}

```

## willRun()

决定 Job 是否执行`run`函数。

因为执行一次 Job 的开销是很大的，要发出请求，再解析请求。我们可以在 Job 将要执行前进行判断，例如 SteamCN 日报一般只会在下午进行发布，所以我们可以判断时间是否大于中午，是则返回`true` Job 将会被调度至等待队列，将被执行，否则跳过该 Job。

- **参数**：无
- **返回类型**：Boolean
- **用法**：

```ts
class MyJob extends Job{
	// ...

	async willRun() {
		let h = (new Date).getHours()
		if (h > 15) { // 晚于15点时才执行 Job
			return true
		}
		return false
	}
}

```

## request(req, cb)

向 Engine 发出单个请求。

第二个参数为一个回调函数，不推荐单个请求时使用，IGetter 推荐使用 `async/await` 的形式来书写 Job。

- **参数**：
	- `req: fetchRequest`：请求信息，详细参考 // TODO
	- `cb?: Fucntion`：可选回调函数，参数为`Fetch`
- **返回类型**：`Promise<Fetch>`
- **用法**：

```ts
class MyJob extends Job{
	// ...
	async run() {
		let res = {
			url: 'https://example.com'
		}
		let data = await this.request(req)
		// 处理data
	}
}
```

## requests(reqs, cb)

向 Engine 发出多个请求。

有时我们需要请求多个类似的请求，就可以使用`requests`。在这里推荐使用回调函数的方式来处理请求到的数据，但是还是要使用`await`来阻塞`run`函数。

- **参数**：
	- `reqs: fetchRequest[]`：请求信息的数组，详细参考 // TODO
	- `cb?: Fucntion`：可选回调函数，参数为`Fetch`
- **返回类型**：Promise<Fetch[]>
- **用法**：

```ts
class MyJob extends Job{
	// ...
	async run() {
		let urls = [
			'https://a.com/page/1',
			'https://a.com/page/2',
			'https://a.com/page/3'
		]
		let reqs = urls.map(url => ({
			url
		}))
		await this.requests(reqs, fetch => {
			// 处理data
		})
	}
}
```

## getQueue()

获取

- **参数**：
- **返回类型**：
- **用法**：

```ts

```

## 



- **类型**：
- **默认值**：
- **用法**：

```ts

```
