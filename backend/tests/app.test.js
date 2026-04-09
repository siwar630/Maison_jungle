const request = require('supertest')
const jwt = require('jsonwebtoken')

const mockPrisma = {
	$queryRaw: jest.fn(),
	plant: {
		count: jest.fn(),
		findMany: jest.fn(),
		findUnique: jest.fn()
	},
	user: {
		findUnique: jest.fn(),
		create: jest.fn()
	},
	cart: {
		upsert: jest.fn(),
		findUnique: jest.fn()
	},
	cartItem: {
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		deleteMany: jest.fn()
	},
	order: {
		create: jest.fn()
	}
}

jest.mock('../src/prisma', () => mockPrisma)

const app = require('../src/app')

describe('API', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('GET /api/plants returns paginated response', async () => {
		mockPrisma.plant.count.mockResolvedValue(1)
		mockPrisma.plant.findMany.mockResolvedValue([
			{
				id: '1',
				name: 'monstera',
				category: 'classique',
				bestSale: true,
				light: 2,
				water: 3,
				cover: 'monstera',
				price: 15
			}
		])

		const response = await request(app).get('/api/plants?page=1&pageSize=6')

		expect(response.status).toBe(200)
		expect(response.body.items).toHaveLength(1)
		expect(response.body.total).toBe(1)
		expect(response.body.totalPages).toBe(1)
	})

	test('POST /api/auth/register creates user and returns token', async () => {
		mockPrisma.user.findUnique.mockResolvedValue(null)
		mockPrisma.user.create.mockResolvedValue({
			id: 'u1',
			email: 'user@test.com'
		})

		const response = await request(app)
			.post('/api/auth/register')
			.send({ email: 'user@test.com', password: 'secret123' })

		expect(response.status).toBe(201)
		expect(response.body.token).toBeTruthy()
		expect(response.body.user.email).toBe('user@test.com')
	})

	test('GET /api/cart requires authentication', async () => {
		const response = await request(app).get('/api/cart')
		expect(response.status).toBe(401)
	})

	test('GET /api/cart returns mapped cart data for authenticated user', async () => {
		const token = jwt.sign({ userId: 'u1' }, 'dev-secret')
		mockPrisma.cart.upsert.mockResolvedValue({
			id: 'c1',
			items: [
				{
					plantId: '1ed',
					quantity: 2,
					plant: {
						name: 'monstera',
						price: 15,
						cover: 'monstera'
					}
				}
			]
		})

		const response = await request(app)
			.get('/api/cart')
			.set('Authorization', `Bearer ${token}`)

		expect(response.status).toBe(200)
		expect(response.body.items[0].name).toBe('monstera')
		expect(response.body.total).toBe(30)
	})
})
