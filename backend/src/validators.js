const { z } = require('zod')

const emailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.email('Email invalide')
	.max(255)

const registerSchema = z.object({
	email: emailSchema,
	password: z
		.string()
		.trim()
		.min(8, 'Le mot de passe doit contenir au moins 8 caracteres')
		.max(100)
		.regex(/[A-Za-z]/, 'Le mot de passe doit contenir au moins une lettre')
		.regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
})

const loginSchema = z.object({
	email: emailSchema,
	password: z.string().trim().min(1, 'Mot de passe requis').max(100)
})

const cartAddSchema = z
	.object({
		plantId: z.coerce.string().trim().min(1).optional(),
		plantName: z.string().trim().min(1).optional(),
		quantity: z.number().int().min(1).max(99).optional()
	})
	.refine((value) => Boolean(value.plantId || value.plantName), {
		message: 'plantId or plantName is required',
		path: ['plantId']
	})

const cartUpdateSchema = z.object({
	quantity: z.number().int().min(1).max(99)
})

const plantsQuerySchema = z.object({
	search: z.string().trim().optional(),
	category: z.string().trim().optional(),
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(50).default(12)
})

module.exports = {
	registerSchema,
	loginSchema,
	cartAddSchema,
	cartUpdateSchema,
	plantsQuerySchema
}
