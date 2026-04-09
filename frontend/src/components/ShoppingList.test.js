import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShoppingList from './ShoppingList'
import { fetchPlants } from '../services/api'

jest.mock('../services/api', () => ({
	fetchPlants: jest.fn()
}))

describe('ShoppingList', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('loads catalog and triggers add callback', async () => {
		fetchPlants.mockResolvedValue({
			items: [
				{
					id: '1ed',
					name: 'monstera',
					category: 'classique',
					water: 3,
					light: 2,
					price: 15,
					cover: 'monstera'
				}
			],
			total: 1,
			page: 1,
			pageSize: 6,
			totalPages: 1
		})

		const onAddToCart = jest.fn()
		render(<ShoppingList onAddToCart={onAddToCart} />)

		await waitFor(() => {
			expect(screen.getByText(/monstera/i)).toBeInTheDocument()
		})

		await userEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }))
		expect(onAddToCart).toHaveBeenCalledWith('1ed', 'monstera')
	})
})
