import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import {
  addCartItem,
  fetchCart,
  fetchPlants,
  login
} from '../services/api'

jest.mock('../services/api', () => ({
  fetchPlants: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  fetchCart: jest.fn(),
  addCartItem: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
  clearCart: jest.fn(),
  checkout: jest.fn()
}))

test('authenticates and adds product to cart from API flow', async () => {
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

  login.mockResolvedValue({
    token: 'token-1',
    user: { id: 'u1', email: 'demo@maison-jungle.com' }
  })

  fetchCart.mockResolvedValue({ items: [], total: 0 })

  addCartItem.mockResolvedValue({
    items: [{ plantId: '1ed', name: 'monstera', price: 15, amount: 1 }],
    total: 15
  })

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText(/notre collection/i)).toBeInTheDocument()
  })

  await userEvent.click(screen.getByRole('button', { name: /get started/i }))
  await userEvent.clear(screen.getByPlaceholderText(/email/i))
  await userEvent.type(screen.getByPlaceholderText(/email/i), 'demo@maison-jungle.com')
  await userEvent.clear(screen.getByPlaceholderText(/mot de passe/i))
  await userEvent.type(screen.getByPlaceholderText(/mot de passe/i), 'demopass123')

  await userEvent.click(screen.getByRole('button', { name: /connexion/i }))

  await waitFor(() => {
    expect(screen.getByText(/connecte: demo@maison-jungle.com/i)).toBeInTheDocument()
  })

  await userEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }))

  await waitFor(() => {
    expect(screen.getByText(/1 x 15€/i)).toBeInTheDocument()
  })

  expect(addCartItem).toHaveBeenCalledWith('token-1', '1ed', 1, 'monstera')
})
