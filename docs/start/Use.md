
# 面向IGeter使用者

IGetter的使用是非常简单的，例子如下：

```ts
import { Engine, Downloader} from 'igetter'
import Steamcn form 'igetter-job-steamcn'

let E = new Engine() // 构造Engine实例
let D = new Downloader() // 构造Downloader实例

D.attachEngine(E) // Downloader连接至Engine

E.addJob(new Steamcn()) // 添加任务

E.run() // IGetter开始运行

```

# 面向Job编写者

Job的编写、维护是非常耗时耗力的。所以这也是急需大家贡献力量的地方。

如果你有想法，请提出PR。



# 面向Plugin编写者

