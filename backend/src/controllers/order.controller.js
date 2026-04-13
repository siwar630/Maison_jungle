const {
	checkout,
	listUserOrders,
	cancelUserOrder
} = require('../services/order.service')

async function listOrders(req, res) {
	const payload = await listUserOrders(req.user.id)
	res.json(payload)
}

async function checkoutOrder(req, res) {
	const payload = await checkout(req.user.id)
	res.status(201).json(payload)
}

async function cancelOrder(req, res) {
	const payload = await cancelUserOrder(req.user.id, req.params.orderId)
	res.json(payload)
}

module.exports = {
	checkoutOrder,
	listOrders,
	cancelOrder
}