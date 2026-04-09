const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require('express')
const cors = require('cors')
const prisma = require('./prisma')

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`
		res.json({ ok: true, message: 'API and database are reachable' })
	} catch (error) {
		res.status(500).json({ ok: false, message: 'Database connection failed' })
	}
})

app.get('/api/plants', async (_req, res) => {
	try {
		const plants = await prisma.plant.findMany({
			orderBy: { name: 'asc' }
		})

		res.json(
			plants.map((plant) => ({
				...plant,
				price: Number(plant.price)
			}))
		)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Failed to fetch plants' })
	}
})

app.get('/api/categories', async (_req, res) => {
	try {
		const categories = await prisma.plant.findMany({
			distinct: ['category'],
			select: { category: true },
			orderBy: { category: 'asc' }
		})

		res.json(categories.map((item) => item.category))
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Failed to fetch categories' })
	}
})

process.on('SIGINT', async () => {
	await prisma.$disconnect()
	process.exit(0)
})

process.on('SIGTERM', async () => {
	await prisma.$disconnect()
	process.exit(0)
})

app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`)
})
