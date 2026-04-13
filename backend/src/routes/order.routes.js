const express = require('express')
const { asyncHandler } = require('../utils/http')
const { requireAuth } = require('../middlewares/auth')
const {
	checkoutOrder,
	listOrders,
	cancelOrder
} = require('../controllers/order.controller')

const router = express.Router()

router.get('/orders', requireAuth, asyncHandler(listOrders))
router.post('/orders/checkout', requireAuth, asyncHandler(checkoutOrder))
router.patch('/orders/:orderId/cancel', requireAuth, asyncHandler(cancelOrder))

module.exports = router