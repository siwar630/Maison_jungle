const { checkout } = require('../services/order.service')

async function checkoutOrder(req, res) {
	const payload = await checkout(req.user.id)
	res.status(201).json(payload)
}

module.exports = {
	checkoutOrder
}