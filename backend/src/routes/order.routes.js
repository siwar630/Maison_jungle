const express = require('express')
const { asyncHandler } = require('../utils/http')
const { requireAuth } = require('../middlewares/auth')
const { checkoutOrder } = require('../controllers/order.controller')

const router = express.Router()

router.post('/orders/checkout', requireAuth, asyncHandler(checkoutOrder))

module.exports = router