const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = require('./prisma')
const { requireAuth } = require('./middleware/auth')
const {
	registerSchema,
	loginSchema,
	cartAddSchema,
	cartUpdateSchema,
	plantsQuerySchema
} = require('./validators')
const { AppError, asyncHandler } = require('./utils/http')

function sanitizePlant(plant) {
	return {
		...plant,
		price: Number(plant.price)
	}
}

function mapCartResponse(cart) {
	const items = cart.items.map((item) => ({
		plantId: item.plantId,
		name: item.plant.name,
		price: Number(item.plant.price),
		amount: item.quantity,
		cover: item.plant.cover
	}))

	const total = items.reduce((acc, item) => acc + item.price * item.amount, 0)

	return {
		items,
		total
	}
}

const app = express()

const allowedOrigins = new Set([
	'http://localhost:3000',
	'http://localhost:3001',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:3001'
])

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.has(origin)) {
				callback(null, true)
				return
			}
			callback(new Error(`CORS blocked for origin ${origin}`))
		},
		credentials: true
	})
)
app.use(express.json())

app.get('/api/health', asyncHandler(async (_req, res) => {
	await prisma.$queryRaw`SELECT 1`
	res.json({ ok: true, message: 'API and database are reachable' })
}))

app.post('/api/auth/register', asyncHandler(async (req, res) => {
	const data = registerSchema.parse(req.body)
	const exists = await prisma.user.findUnique({ where: { email: data.email } })

	if (exists) {
		throw new AppError(409, 'Email already registered')
	}

	const passwordHash = await bcrypt.hash(data.password, 10)
	const user = await prisma.user.create({
		data: {
			email: data.email,
			passwordHash,
			cart: { create: {} }
		}
	})

	const token = jwt.sign(
		{ userId: user.id },
		process.env.JWT_SECRET || 'dev-secret',
		{ expiresIn: '7d' }
	)

	res.status(201).json({ token, user: { id: user.id, email: user.email } })
}))

app.post('/api/auth/login', asyncHandler(async (req, res) => {
	const data = loginSchema.parse(req.body)
	const user = await prisma.user.findUnique({ where: { email: data.email } })

	if (!user) {
		throw new AppError(401, 'Invalid credentials')
	}

	const validPassword = await bcrypt.compare(data.password, user.passwordHash)
	if (!validPassword) {
		throw new AppError(401, 'Invalid credentials')
	}

	await prisma.cart.upsert({
		where: { userId: user.id },
		update: {},
		create: { userId: user.id }
	})

	const token = jwt.sign(
		{ userId: user.id },
		process.env.JWT_SECRET || 'dev-secret',
		{ expiresIn: '7d' }
	)

	res.json({ token, user: { id: user.id, email: user.email } })
}))

app.get('/api/plants', asyncHandler(async (req, res) => {
	const query = plantsQuerySchema.parse(req.query)
	const where = {
		AND: [
			query.search
				? { name: { contains: query.search, mode: 'insensitive' } }
				: {},
			query.category ? { category: query.category } : {}
		]
	}

	const [total, plants] = await Promise.all([
		prisma.plant.count({ where }),
		prisma.plant.findMany({
			where,
			orderBy: { name: 'asc' },
			skip: (query.page - 1) * query.pageSize,
			take: query.pageSize
		})
	])

	res.json({
		items: plants.map(sanitizePlant),
		total,
		page: query.page,
		pageSize: query.pageSize,
		totalPages: Math.max(1, Math.ceil(total / query.pageSize))
	})
}))

app.get('/api/categories', asyncHandler(async (_req, res) => {
	const categories = await prisma.plant.findMany({
		distinct: ['category'],
		select: { category: true },
		orderBy: { category: 'asc' }
	})

	res.json(categories.map((item) => item.category))
}))

app.get('/api/cart', requireAuth, asyncHandler(async (req, res) => {
	const cart = await prisma.cart.upsert({
		where: { userId: req.user.id },
		update: {},
		create: { userId: req.user.id },
		include: {
			items: {
				include: { plant: true },
				orderBy: { createdAt: 'asc' }
			}
		}
	})

	res.json(mapCartResponse(cart))
}))

app.post('/api/cart/items', requireAuth, asyncHandler(async (req, res) => {
	const data = cartAddSchema.parse(req.body)
	const quantityToAdd = data.quantity || 1

	const cart = await prisma.cart.upsert({
		where: { userId: req.user.id },
		update: {},
		create: { userId: req.user.id }
	})

	const plant = data.plantId
		? await prisma.plant.findUnique({ where: { id: data.plantId } })
		: await prisma.plant.findFirst({
			where: { name: { equals: data.plantName, mode: 'insensitive' } }
		})
	if (!plant) {
		throw new AppError(404, 'Plant not found for provided id/name')
	}

	const existing = await prisma.cartItem.findUnique({
		where: {
			cartId_plantId: {
				cartId: cart.id,
				plantId: plant.id
			}
		}
	})

	if (existing) {
		await prisma.cartItem.update({
			where: { id: existing.id },
			data: { quantity: existing.quantity + quantityToAdd }
		})
	} else {
		await prisma.cartItem.create({
			data: {
				cartId: cart.id,
				plantId: plant.id,
				quantity: quantityToAdd
			}
		})
	}

	const updatedCart = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: {
			items: {
				include: { plant: true },
				orderBy: { createdAt: 'asc' }
			}
		}
	})

	res.status(201).json(mapCartResponse(updatedCart))
}))

app.put('/api/cart/items/:plantId', requireAuth, asyncHandler(async (req, res) => {
	const data = cartUpdateSchema.parse(req.body)

	const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } })
	if (!cart) {
		throw new AppError(404, 'Cart not found')
	}

	const item = await prisma.cartItem.findUnique({
		where: {
			cartId_plantId: {
				cartId: cart.id,
				plantId: req.params.plantId
			}
		}
	})

	if (!item) {
		throw new AppError(404, 'Cart item not found')
	}

	await prisma.cartItem.update({
		where: { id: item.id },
		data: { quantity: data.quantity }
	})

	const updatedCart = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: {
			items: {
				include: { plant: true },
				orderBy: { createdAt: 'asc' }
			}
		}
	})

	res.json(mapCartResponse(updatedCart))
}))

app.delete('/api/cart/items/:plantId', requireAuth, asyncHandler(async (req, res) => {
	const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } })
	if (!cart) {
		throw new AppError(404, 'Cart not found')
	}

	await prisma.cartItem.deleteMany({
		where: {
			cartId: cart.id,
			plantId: req.params.plantId
		}
	})

	const updatedCart = await prisma.cart.findUnique({
		where: { id: cart.id },
		include: {
			items: {
				include: { plant: true },
				orderBy: { createdAt: 'asc' }
			}
		}
	})

	res.json(mapCartResponse(updatedCart))
}))

app.delete('/api/cart', requireAuth, asyncHandler(async (req, res) => {
	const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } })
	if (!cart) {
		res.json({ items: [], total: 0 })
		return
	}

	await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
	res.json({ items: [], total: 0 })
}))

app.post('/api/orders/checkout', requireAuth, asyncHandler(async (req, res) => {
	const cart = await prisma.cart.findUnique({
		where: { userId: req.user.id },
		include: { items: { include: { plant: true } } }
	})

	if (!cart || cart.items.length === 0) {
		throw new AppError(400, 'Cart is empty')
	}

	const total = cart.items.reduce(
		(acc, item) => acc + Number(item.plant.price) * item.quantity,
		0
	)

	const order = await prisma.order.create({
		data: {
			userId: req.user.id,
			total,
			items: {
				create: cart.items.map((item) => ({
					plantId: item.plantId,
					quantity: item.quantity,
					unitPrice: item.plant.price
				}))
			}
		},
		include: {
			items: true
		}
	})

	await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
	res.status(201).json({ orderId: order.id, total: Number(order.total) })
}))

app.use((error, _req, res, _next) => {
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

	if (statusCode >= 500 && !error.isOperational) {
		console.error(error)
	}

	res.status(statusCode).json({ message })
})

module.exports = app
