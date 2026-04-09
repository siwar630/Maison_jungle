class AppError extends Error {
	constructor(statusCode, message) {
		super(message)
		this.statusCode = statusCode
		this.isOperational = true
	}
}

function asyncHandler(handler) {
	return async (req, res, next) => {
		try {
			await handler(req, res, next)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = {
	AppError,
	asyncHandler
}
