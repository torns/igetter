import { Response } from "superagent";

export default function createError(error: any, fetchError: fetchError) {
	let err = new ErrorBuilder(error, fetchError)
	err
		.buildMessage()
		.buildResponse()
		.buildStatus()
		.buildNative()

	return err.getFetchError()
}
interface requestError{
	message: string,
	response: Response | undefined,
	code?: string,
	status?: number
}
class ErrorBuilder{
	private error: requestError
	private fetchError: fetchError
	constructor(error: requestError, fetchError: fetchError){
		this.error = error
		this.fetchError = fetchError
	}
	getFetchError(){
		return this.fetchError
	}
	buildMessage(){
		this.fetchError.message = this.error.message
		return this
	}
	buildStatus(){
		this.fetchError.status = this.error.status || this.error.code
		return this
	}
	buildResponse(){
		this.fetchError.response = this.error.response
		return this
	}
	buildNative(){
		this.fetchError._error = this.error
		return this
	}
}