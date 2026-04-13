const prisma = require('../prisma')
const { AppError } = require('../utils/http')

function mapCartResponse(cart) {
	// Normalise le format renvoye au front pour garder un contrat API stable.
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

async function getOrCreateCartWithItems(userId) {
	// Upsert evite les erreurs "panier inexistant" au premier appel.
	return prisma.cart.upsert({
		where: { userId },
		update: {},
		create: { userId },
		include: {
			items: {
				include: { plant: true },
				orderBy: { createdAt: 'asc' }
			}
		}
	})
}

async function getCart(userId) {
	const cart = await getOrCreateCartWithItems(userId)
	return mapCartResponse(cart)
}

async function addCartItem(userId, data) {
	const quantityToAdd = data.quantity || 1

	const cart = await prisma.cart.upsert({
		where: { userId },
		update: {},
		create: { userId }
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

	return mapCartResponse(updatedCart)
}

async function updateCartItem(userId, plantId, quantity) {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	if (!cart) {
		throw new AppError(404, 'Cart not found')
	}

	const item = await prisma.cartItem.findUnique({
		where: {
			cartId_plantId: {
				cartId: cart.id,
				plantId
			}
		}
	})

	if (!item) {
		throw new AppError(404, 'Cart item not found')
	}

	await prisma.cartItem.update({
		where: { id: item.id },
		data: { quantity }
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

	return mapCartResponse(updatedCart)
}

async function removeCartItem(userId, plantId) {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	if (!cart) {
		throw new AppError(404, 'Cart not found')
	}

	await prisma.cartItem.deleteMany({
		where: {
			cartId: cart.id,
			plantId
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

	return mapCartResponse(updatedCart)
}

async function clearCart(userId) {
	const cart = await prisma.cart.findUnique({ where: { userId } })
	if (!cart) {
		return { items: [], total: 0 }
	}

	await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
	return { items: [], total: 0 }
}

module.exports = {
	getCart,
	addCartItem,
	updateCartItem,
	removeCartItem,
	clearCart
}