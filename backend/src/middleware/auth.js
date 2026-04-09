const jwt = require('jsonwebtoken')
const { AppError } = require('../utils/http')

function requireAuth(req, _res, next) {
	const header = req.headers.authorization || ''
	const [scheme, token] = header.split(' ')

	if (scheme !== 'Bearer' || !token) {
		return next(new AppError(401, 'Authentication required'))
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
		req.user = { id: payload.userId }
		next()
	} catch (_error) {
		next(new AppError(401, 'Invalid token'))
	}
}

module.exports = {
	requireAuth
}
