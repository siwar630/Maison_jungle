const prisma = require('../prisma')
const { AppError } = require('../utils/http')

function mapOrder(order) {
	const items = order.items.map((item) => ({
		id: item.id,
		plantId: item.plantId,
		name: item.plant.name,
		quantity: item.quantity,
		unitPrice: Number(item.unitPrice),
		subtotal: Number(item.unitPrice) * item.quantity
	}))

	return {
		id: order.id,
		status: order.status,
		total: Number(order.total),
		createdAt: order.createdAt,
		items
	}
}

async function listUserOrders(userId) {
	const orders = await prisma.order.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		include: {
			items: {
				include: {
					plant: {
						select: { name: true }
					}
				}
			}
		}
	})

	return {
		items: orders.map(mapOrder)
	}
}

async function cancelUserOrder(userId, orderId) {
	const order = await prisma.order.findFirst({
		where: { id: orderId, userId }
	})

	if (!order) {
		throw new AppError(404, 'Order not found')
	}

	if (order.status !== 'placed') {
		throw new AppError(400, 'Only placed orders can be cancelled')
	}

	const updated = await prisma.order.update({
		where: { id: order.id },
		data: { status: 'cancelled' },
		include: {
			items: {
				include: {
					plant: {
						select: { name: true }
					}
				}
			}
		}
	})

	return mapOrder(updated)
}

async function checkout(userId) {
	const cart = await prisma.cart.findUnique({
		where: { userId },
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
			userId,
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

	return {
		orderId: order.id,
		total: Number(order.total)
	}
}

module.exports = {
	checkout,
	listUserOrders,
	cancelUserOrder
}