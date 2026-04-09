const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {})
		},
		...options
	})

	if (!response.ok) {
		let message = 'API request failed'
		try {
			const payload = await response.json()
			if (payload.message) {
				message = payload.message
			}
			if (Array.isArray(payload.errors) && payload.errors.length > 0) {
				message = payload.errors
					.map((item) => `${item.path || 'field'}: ${item.message}`)
					.join(' | ')
			}
		} catch (_error) {
			message = `HTTP ${response.status}`
		}
		throw new Error(message)
	}

	if (response.status === 204) {
		return null
	}

	return response.json()
}

export async function fetchPlants(params = {}) {
	const searchParams = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.set(key, String(value))
		}
	})

	const query = searchParams.toString()
	const path = query ? `/plants?${query}` : '/plants'

	return request(path)
}

export async function register(payload) {
	return request('/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload)
	})
}

export async function login(payload) {
	return request('/auth/login', {
		method: 'POST',
		body: JSON.stringify(payload)
	})
}

function authHeaders(token) {
	return {
		Authorization: `Bearer ${token}`
	}
}

export async function fetchCart(token) {
	return request('/cart', {
		headers: authHeaders(token)
	})
}

export async function addCartItem(token, plantId, quantity = 1, plantName) {
	const normalizedPlantId =
		plantId !== undefined && plantId !== null ? String(plantId) : undefined
	const normalizedPlantName = plantName ? String(plantName).trim() : undefined

	return request('/cart/items', {
		method: 'POST',
		headers: authHeaders(token),
		body: JSON.stringify({
			plantId: normalizedPlantId,
			plantName: normalizedPlantName,
			quantity
		})
	})
}

export async function updateCartItem(token, plantId, quantity) {
	return request(`/cart/items/${plantId}`, {
		method: 'PUT',
		headers: authHeaders(token),
		body: JSON.stringify({ quantity })
	})
}

export async function removeCartItem(token, plantId) {
	return request(`/cart/items/${plantId}`, {
		method: 'DELETE',
		headers: authHeaders(token)
	})
}

export async function clearCart(token) {
	return request('/cart', {
		method: 'DELETE',
		headers: authHeaders(token)
	})
}

export async function checkout(token) {
	return request('/orders/checkout', {
		method: 'POST',
		headers: authHeaders(token)
	})
}
