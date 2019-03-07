import Job from '../../src/Job/Job'
import Engine from '../../src/Engine/Engine'
import Store from '../../src/Store/Store'

jest.mock('../../src/Engine/Engine.ts')
describe('Job test', () => {
	const resultObj = {
		test: 'data'
	}
	let runMock = jest.fn()
	let saveMock = jest.fn()
	class TestJob extends Job{
		public JobName = 'test-job'
		public majorVer = '0'
		public minorVer = '1'
		public isSave: boolean
		constructor(isSave){
			super()
			this.isSave = isSave
		}
		async run(){
			runMock()
			if (this.isSave) {
				return resultObj				
			} else {
				return this.isSave
			}
		}
		async save(res){
			saveMock(res)
		}
	}
	test('attach and detach engine', () => {
		let e = new Engine()
		let j = new TestJob(true)
		j.attachEngine(e)
		expect(e.emit).toBeCalledTimes(1)
		expect(j.engine).toEqual(e)
		j.detachEngine()
		expect(e.emit).toBeCalledTimes(2)
	})
	test('will run', async() => {
		let j = new TestJob(true)
		let willRun = await j.willRun()
		expect(willRun).toBe(true)
	})
	test('set job id', () => {
		let j = new TestJob(true)
		j.setID()
		expect(j.id).not.toBeUndefined()
	})
	test('active and inactive job', () => {
		let j = new TestJob(true)
		expect(j.store).toBeUndefined()
		expect(j.isActive).toBe(false)
		j.active()
		expect(j.store).toBeInstanceOf(Store)
		expect(j.isActive).toBe(true)
		j.inactive()
		expect(j.store).toBeUndefined()
		expect(j.isActive).toBe(false)
	})
	test('_run and _save job', async() => {
		let j = new TestJob(true)
		let e = new Engine()
		await j._run(e)
		expect(runMock).toBeCalledTimes(1)
		expect(saveMock).toBeCalledTimes(1)
		expect(saveMock).toBeCalledWith(resultObj)
	})
		test('_run and not _save job', async() => {
		let j = new TestJob(false)
		let e = new Engine()
		await j._run(e)
		expect(runMock).toBeCalledTimes(2)
		expect(saveMock).toBeCalledTimes(1)
	})
})