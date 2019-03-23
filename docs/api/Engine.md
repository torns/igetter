
Engine 主要功能有：接收 Job 发出的请求，分发 Downloader 的响应，以及 Job 的调度，Plugin 的引入。

## Engine()

创建一个Engine实例。

- **参数**：
	- `cfg: config`：
		- `concurrency?: Number = 4` 并发下载数量
- **返回类型**：`Engine`
- **用法**：

```ts
let engine = new Engine({
	concurrency: 5
})
```

## run()

运行Engine实例。

- **参数**：无
- **返回类型**：无
- **用法**：

```ts
engine.run()
```

## addJob(job: Job)

向引擎添加 Job 实例。

- **参数**：`Job`（参见Job//TODO）
	
- **返回类型**：无

- **用法**：

```ts
class SteamCN extends Job{
	// ...
}
engine.add(new SteamCN())
```

## getActiveJob()

获取当前正在执行的 Job 实例。

- **参数**：无
	
- **默认参数**：无

- **用法**：

```ts
let activeJob = engine.getActiveJob()

```
## use(Plugin)

引入插件。

- **参数**：`Plugin`
- **返回类型**：无
- **用法**：

```ts
class GetHeaders extends Plugin{
	// ...
}
engine.use(new GetHeaders)
```

## setConfig(config)

设置Engine实例的参数。

- **参数**：`config`
- **返回类型**：无
- **用法**：

```ts
engine.setConfig({
	concurrency: 5
})
```

## listen(cb)

消费 Job 爬取的信息。

- **参数**：`Function`
- **返回类型**：无
- **用法**：

```ts
engine.listen(data: any => {
	console.log(any)
})
```

## 



- **参数**：
- **返回类型**：
- **用法**：

```ts

```
