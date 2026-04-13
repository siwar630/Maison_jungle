const express = require('express')
const { asyncHandler } = require('../utils/http')
const { getPlants, getCategories } = require('../controllers/plant.controller')

const router = express.Router()

router.get('/plants', asyncHandler(getPlants))
router.get('/categories', asyncHandler(getCategories))

module.exports = router