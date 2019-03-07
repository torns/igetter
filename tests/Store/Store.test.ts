import Store from '../../src/Store/Store'
import * as DataStore from 'nedb'

jest.mock('nedb')

// let p  = () => new Promise((res, rej) => {
// 	setTimeout(res, 1)
// })

// DataStore.prototype.update = jest.fn().mockResolvedValue('result')
// DataStore.prototype.find = jest.fn().mockResolvedValue('result')
// DataStore.prototype.findOne = jest.fn().mockResolvedValue('result')
// DataStore.prototype.count = jest.fn().mockResolvedValue('result')
// DataStore.prototype.remove = jest.fn().mockResolvedValue('result')
describe('Store test', () => {
	test('store.connect', () => {
		let store = new Store('jestTest')
		let db = store.getDB()
		expect(db).toBeUndefined()
		store.connect()
		expect(DataStore).toBeCalledTimes(1)
		expect(DataStore.prototype.loadDatabase).toBeCalledTimes(1)
	})
	test('store.disconnect', () => {
		let store = new Store('jestTest')
		let db = store.getDB()
		store.connect()
		store.disconnect()
		expect(db).toBeUndefined()
	})
	test('store.insert', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.insert).toBeCalledTimes(1)
			done()
		}, 500)
		await store.insert(doc)
		
	})
	test('store.find', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.find).toBeCalledTimes(1)
			done()
		}, 500)
		await store.find(doc)
	})
	test('store.findOne', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.findOne).toBeCalledTimes(1)
			done()
		}, 500);
		await store.findOne(doc)
	})
	test('store.count', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.count).toBeCalledTimes(1)
			done()
		},500)
		await store.count(doc)
	})
	test('store.update', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let query = {
			test: 'test'
		}
		let update = {
			test: 'jes-test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.update).toBeCalledTimes(1)
			done()
		}, 500)
		await store.update(query, update)
	})
	test('store.remove', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		setTimeout(() => {
			expect(DataStore.prototype.remove).toBeCalledTimes(1)
			done()
		}, 500)
		await store.remove(doc)
	})
	test('store.getLast', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		store.findOne = jest.fn()
		setTimeout(() => {
			expect(store.findOne).toBeCalledTimes(1) // TODO: why not 1
			done()
		}, 500)
		store.getLast()
	})
	test('store.setLast (no last)', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		store.getLast = jest.fn()
		store.update = jest.fn()
		store.insert = jest.fn()
		setTimeout(() => {
			expect(store.getLast).toBeCalledTimes(1)
			expect(store.update).toBeCalledTimes(1)
			expect(store.insert).toBeCalledTimes(1)
			done()
		}, 500)
		await store.setLast(doc)
	})
	test('store.setLast (has last)', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		let doc = {
			test: 'test'
		}
		store.getLast = jest.fn().mockReturnValue({
			test: 'last',
			id: 'test-id'
		})
		store.update = jest.fn()
		store.insert = jest.fn()
		setTimeout(() => {
			expect(store.getLast).toBeCalledTimes(1)
			expect(store.update).toBeCalledTimes(1)
			expect(store.insert).toBeCalledTimes(1)
			done()
		}, 500)
		await store.setLast(doc)
	})
	test('store.getAll', async(done) => {
		let store = new Store('jestTest')
		store.connect()
		store.find = jest.fn()
		setTimeout(() => {
			expect(store.find).toBeCalledTimes(1)
			done()
		}, 500)
		await store.getAll()
	})
})