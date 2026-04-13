const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const prisma = require('../prisma')
const { AppError } = require('../utils/http')

function signAccessToken(userId) {
	return jwt.sign(
		{ userId },
		process.env.JWT_SECRET || 'dev-secret',
		{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
	)
}

function buildAuthPayload(user) {
	const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
	const token = signAccessToken(user.id)

	return {
		token,
		tokenType: 'Bearer',
		expiresIn,
		user: { id: user.id, email: user.email }
	}
}

async function registerUser({ email, password }) {
	const existingUser = await prisma.user.findUnique({ where: { email } })
	if (existingUser) {
		throw new AppError(409, 'Email already registered')
	}

	// Le mot de passe n'est jamais stocke en clair.
	const passwordHash = await bcrypt.hash(password, 10)
	const user = await prisma.user.create({
		data: {
			email,
			passwordHash,
			cart: { create: {} }
		}
	})

	return buildAuthPayload(user)
}

async function loginUser({ email, password }) {
	const user = await prisma.user.findUnique({ where: { email } })
	if (!user) {
		throw new AppError(401, 'Invalid credentials')
	}

	// Compare le mot de passe brut avec le hash en base.
	const validPassword = await bcrypt.compare(password, user.passwordHash)
	if (!validPassword) {
		throw new AppError(401, 'Invalid credentials')
	}

	await prisma.cart.upsert({
		where: { userId: user.id },
		update: {},
		create: { userId: user.id }
	})

	return buildAuthPayload(user)
}

async function getAuthenticatedUser(userId) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, email: true }
	})

	if (!user) {
		throw new AppError(404, 'User not found')
	}

	return { user }
}

module.exports = {
	registerUser,
	loginUser,
	getAuthenticatedUser
}