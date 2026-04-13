const { registerSchema, loginSchema } = require('../validators')
const {
	registerUser,
	loginUser,
	getAuthenticatedUser
} = require('../services/auth.service')

async function register(req, res) {
	const data = registerSchema.parse(req.body)
	const result = await registerUser(data)
	res.status(201).json(result)
}

async function login(req, res) {
	const data = loginSchema.parse(req.body)
	const result = await loginUser(data)
	res.json(result)
}

async function me(req, res) {
	const result = await getAuthenticatedUser(req.user.id)
	res.json(result)
}

module.exports = {
	register,
	login,
	me
}