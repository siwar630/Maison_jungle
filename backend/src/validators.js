const { z } = require('zod')

const registerSchema = z.object({
	email: z.string().trim().email(),
	password: z.string().trim().min(6).max(100)
})

const loginSchema = registerSchema

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
