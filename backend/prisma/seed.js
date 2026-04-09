const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const plants = [
	{
		id: '1ed',
		name: 'monstera',
		category: 'classique',
		bestSale: true,
		light: 2,
		water: 3,
		cover: 'monstera',
		price: 15
	},
	{
		id: '2ab',
		name: 'ficus lyrata',
		category: 'classique',
		bestSale: false,
		light: 3,
		water: 1,
		cover: 'lyrata',
		price: 16
	},
	{
		id: '3sd',
		name: 'pothos argente',
		category: 'classique',
		bestSale: false,
		light: 1,
		water: 2,
		cover: 'pothos',
		price: 9
	},
	{
		id: '4kk',
		name: 'calathea',
		category: 'classique',
		bestSale: false,
		light: 2,
		water: 3,
		cover: 'calathea',
		price: 20
	},
	{
		id: '5pl',
		name: 'olivier',
		category: 'exterieur',
		bestSale: false,
		light: 3,
		water: 1,
		cover: 'olivier',
		price: 25
	},
	{
		id: '8fp',
		name: 'cactus',
		category: 'plante grasse',
		bestSale: false,
		light: 2,
		water: 1,
		cover: 'cactus',
		price: 6
	},
	{
		id: '7ie',
		name: 'basilique',
		category: 'exterieur',
		bestSale: true,
		light: 2,
		water: 3,
		cover: 'basil',
		price: 5
	},
	{
		id: '9vn',
		name: 'succulente',
		category: 'plante grasse',
		bestSale: false,
		light: 2,
		water: 1,
		cover: 'succulent',
		price: 8
	},
	{
		id: '6uo',
		name: 'menthe',
		category: 'exterieur',
		bestSale: false,
		light: 2,
		water: 2,
		cover: 'mint',
		price: 4
	}
]

async function main() {
	for (const plant of plants) {
		await prisma.plant.upsert({
			where: { id: plant.id },
			update: plant,
			create: plant
		})
	}

	console.log(`Seed completed: ${plants.length} plants upserted.`)
}

main()
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
