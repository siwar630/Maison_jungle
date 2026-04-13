const express = require('express')
const { asyncHandler } = require('../utils/http')
const { requireAuth } = require('../middlewares/auth')
const {
	readCart,
	createCartItem,
	editCartItem,
	deleteCartItem,
	deleteCart
} = require('../controllers/cart.controller')

const router = express.Router()

router.get('/cart', requireAuth, asyncHandler(readCart))
router.post('/cart/items', requireAuth, asyncHandler(createCartItem))
router.put('/cart/items/:plantId', requireAuth, asyncHandler(editCartItem))
router.delete('/cart/items/:plantId', requireAuth, asyncHandler(deleteCartItem))
router.delete('/cart', requireAuth, asyncHandler(deleteCart))

module.exports = router