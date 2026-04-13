function errorHandler(error, _req, res, _next) {
	if (error.name === 'ZodError') {
		res.status(400).json({
			message: 'Validation failed',
			errors: error.issues.map((issue) => ({
				path: issue.path.join('.'),
				message: issue.message
			}))
		})
		return
	}

	const statusCode = error.statusCode || 500
	const message = error.isOperational
		? error.message
		: 'Internal server error'

	// Unexpected errors stay visible in backend logs for debugging.
	if (statusCode >= 500 && !error.isOperational) {
		console.error(error)
	}

	res.status(statusCode).json({ message })
}

module.exports = {
	errorHandler
}