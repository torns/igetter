import Fetch from '../../src/Fetcher/Fetch'

describe('Fetch', () => {
	let args: fetchRequest = {} as fetchRequest
	let fetch = new Fetch(args)
	test('blank args test', () => {
		expect(fetch.request.url).toBeUndefined()
	})
	test('normal fetch test', () => {
		args = {
			method: 'post',
			url: 'https://blog.larendorr.com'
		}
		fetch = new Fetch(args)
		expect(fetch.request.url).toEqual(args.url)
		expect(fetch.request.method).toEqual(args.method)
	})
	test('illegal url test', () => {
		args = {
			url: 'httppp://test/'
		}
		fetch = new Fetch(args)
		expect(fetch.request.url).toBeUndefined()
	})
	test('set FectherID test', () => {
		args = {
			url: 'https://blog.larendorr.com'
		}
		let testID = '123456'
		fetch = new Fetch(args)
		fetch.setFetcherID(testID)
		expect(fetch.fetcherID).toEqual(testID)
	})
})