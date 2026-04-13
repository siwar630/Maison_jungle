const prisma = require('../prisma')

async function getHealth(_req, res) {
	await prisma.$queryRaw`SELECT 1`
	res.json({ ok: true, message: 'API and database are reachable' })
}

module.exports = {
	getHealth
}