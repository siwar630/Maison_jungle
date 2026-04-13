const { cartAddSchema, cartUpdateSchema } = require('../validators')
const {
	getCart,
	addCartItem,
	updateCartItem,
	removeCartItem,
	clearCart
} = require('../services/cart.service')

async function readCart(req, res) {
	const payload = await getCart(req.user.id)
	res.json(payload)
}

async function createCartItem(req, res) {
	const data = cartAddSchema.parse(req.body)
	const payload = await addCartItem(req.user.id, data)
	res.status(201).json(payload)
}

async function editCartItem(req, res) {
	const data = cartUpdateSchema.parse(req.body)
	const payload = await updateCartItem(req.user.id, req.params.plantId, data.quantity)
	res.json(payload)
}

async function deleteCartItem(req, res) {
	const payload = await removeCartItem(req.user.id, req.params.plantId)
	res.json(payload)
}

async function deleteCart(req, res) {
	const payload = await clearCart(req.user.id)
	res.json(payload)
}

module.exports = {
	readCart,
	createCartItem,
	editCartItem,
	deleteCartItem,
	deleteCart
}