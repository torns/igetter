import Fetcher from '../../src/Fetcher/Fetcher'
import Engine from '../../src/Engine/Engine'

jest.mock('../../src/Engine/Engine.ts')
describe('Fetcher', () => {
	test('request single fetch', () => {
		let fetcher = new Fetcher()
		let engine = new Engine()
		fetcher.engine = engine
		let request = {
			url: 'http://localhost'
		}
		fetcher.request(request)
		expect(engine.emit).toBeCalledTimes(1)
	})
	test('request multi fetchs', () => {
		let fetcher = new Fetcher()
		let engine = new Engine()
		fetcher.engine = engine
		let requests = [{
				url: 'https://www.bilibili.com'
			},
			{
				url: 'https://steamcn.com/forum.php'
			},
			{
				url: 'https://blog.larendorr.cn'
			}
		]
		fetcher.requests(requests)
		expect(engine.emit).toBeCalledTimes(3)
	})
	test('request with callbacks', async () => {
		let fetcher = new Fetcher()
		let engine = new Engine()
		fetcher.engine = engine
		let queue = fetcher.getQueue()
		let request = {
			url: 'http://localhost',
			_id: 'test id'
		}
		let mockCB = jest.fn()
		setTimeout(() => {
			let fetchID
			for (const id of queue.keys()) {
				fetchID = id
			}
			fetcher.emit('downloaded', {
				fetchID
			})
		}, 1000)
		await fetcher.request(request, mockCB)
		expect(mockCB).toBeCalledTimes(1)
	})
	test(`fetcher hasn't engine`, () => {
		let fetcher = new Fetcher()
		let request = {
			url: 'http://localhost'
		}
		fetcher.request(request)
	})
})