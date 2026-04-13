const express = require('express')
const { asyncHandler } = require('../utils/http')
const { requireAuth } = require('../middlewares/auth')
const { register, login, me } = require('../controllers/auth.controller')

const router = express.Router()

router.post('/auth/register', asyncHandler(register))
router.post('/auth/login', asyncHandler(login))
router.get('/auth/me', requireAuth, asyncHandler(me))

module.exports = router