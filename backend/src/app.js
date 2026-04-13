const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes')
const { errorHandler } = require('./middlewares/error-handler')

const app = express()

const allowedOrigins = new Set([
	'http://localhost:3000',
	'http://localhost:3001',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:3001'
])

app.use(
	cors({
		// CORS whitelist simple pour le front local pendant le dev.
		origin(origin, callback) {
			if (!origin || allowedOrigins.has(origin)) {
				callback(null, true)
				return
			}
			callback(new Error(`CORS blocked for origin ${origin}`))
		},
		credentials: true
	})
)
app.use(express.json())

// Le prefixe /api est applique une seule fois pour toutes les routes metier.
app.use('/api', apiRoutes)

// Dernier middleware: transforme les erreurs en reponses JSON coherentes.
app.use(errorHandler)

module.exports = app
