const { plantsQuerySchema } = require('../validators')
const { listPlants, listCategories } = require('../services/plant.service')

async function getPlants(req, res) {
	const query = plantsQuerySchema.parse(req.query)
	const payload = await listPlants(query)
	res.json(payload)
}

async function getCategories(_req, res) {
	const payload = await listCategories()
	res.json(payload)
}

module.exports = {
	getPlants,
	getCategories
}