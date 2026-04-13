const prisma = require('../prisma')
const { AppError } = require('../utils/http')

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
	checkout
}