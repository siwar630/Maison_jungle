const express = require('express')

const healthRoutes = require('./health.routes')
const authRoutes = require('./auth.routes')
const plantRoutes = require('./plant.routes')
const cartRoutes = require('./cart.routes')
const orderRoutes = require('./order.routes')

const router = express.Router()

// Toutes les routes metier sont centralisees ici pour garder app.js minimal.
router.use(healthRoutes)
router.use(authRoutes)
router.use(plantRoutes)
router.use(cartRoutes)
router.use(orderRoutes)

module.exports = router