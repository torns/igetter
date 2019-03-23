Job 是 Job 编写者主要关注的模块。主要作用为发出请求，解析响应。

## run()

Job 每次执行的函数体。在这里编写 Job 的主要逻辑。该函数返回的非`fasle`值将会被 Engine 交由 Store 存储至该 Job 对应的存储文件中。

- **参数**：无
- **返回类型**：any
- **用法**：

```ts
class MyJob extends Job{
 // ... Job 必要的属性
 async run() {
	 // ... 请求解析数据, 参照sample //TODO
	 return {
		 data: 'data'
	 }
 }
}

```

## willRun()

决定 Job 是否执行`run`函数。
因为执行一次 Job 的开销是很大的，要发出请求，再解析请求。我们可以在 Job 将要执行前进行判断，例如 SteamCN 日报一般只会在下午进行发布，所以我们可以判断事件是否小于中文，是则返回`true` Job 将会被调度至等待队列，将被执行，否则跳过该 Job。

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



- **类型**：
- **默认值**：
- **用法**：

```ts

```

## requests(reqs, cb)



- **类型**：
- **默认值**：
- **用法**：

```ts

```

## getQueue()



- **类型**：
- **默认值**：
- **用法**：

```ts

```

## 



- **类型**：
- **默认值**：
- **用法**：

```ts

```
