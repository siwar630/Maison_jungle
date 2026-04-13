const prisma = require('../prisma')

function sanitizePlant(plant) {
	return {
		...plant,
		price: Number(plant.price)
	}
}

async function listPlants(query) {
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

	return {
		items: plants.map(sanitizePlant),
		total,
		page: query.page,
		pageSize: query.pageSize,
		totalPages: Math.max(1, Math.ceil(total / query.pageSize))
	}
}

async function listCategories() {
	const categories = await prisma.plant.findMany({
		distinct: ['category'],
		select: { category: true },
		orderBy: { category: 'asc' }
	})

	return categories.map((item) => item.category)
}

module.exports = {
	listPlants,
	listCategories
}