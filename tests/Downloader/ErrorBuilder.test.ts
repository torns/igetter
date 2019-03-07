import { Response } from 'superagent'
import createError from '../../src/Downloader/ErrorBuilder'

describe('test error builder', () => {
	let error1 = {
		message: 'test error',
		response: undefined,
		status: 404
	}
	let error2 = {
		message: 'test error2',
		response: {} as Response,
		status: 404
	}
	let error3 = {
		message: 'test error2',
		response: {} as Response,
		code: 'error code'
	}
	let fetchError = {
		message: undefined,
		status: undefined,
		response: undefined,
		_error: undefined
	}
	test('create error message', () => {
		let error = createError(error1,fetchError)
		expect(error.message).toBe(error1.message)
	})
	test('create error status', () => {
		let error = createError(error2,fetchError)
		expect(error.status).toBe(error2.status)
		error = createError(error3,fetchError)
		expect(error.status).toBe(error3.code)
	})
	test('create error response', () => {
		let error = createError(error1,fetchError)
		expect(error.response).toBe(error1.response)
		error = createError(error2,fetchError)
		expect(error.response).toBe(error2.response)
	})
	test('create error native', () => {
		let error = createError(error1,fetchError)
		expect(error._error).toBe(error1)
	})
})