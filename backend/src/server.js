const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const prisma = require('./prisma')
const app = require('./app')
const port = process.env.PORT || 4000

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
