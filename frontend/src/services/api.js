const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'

export async function fetchPlants() {
	const response = await fetch(`${API_BASE_URL}/plants`)
	if (!response.ok) {
		throw new Error('Failed to fetch plants from API')
	}
	return response.json()
}
