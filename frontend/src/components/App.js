import { useState, useEffect } from 'react'
import Banner from './Banner'
import logo from '../assets/logo.png'
import Cart from './Cart'
import Footer from './Footer'
import ShoppingList from './ShoppingList'
import {
	addCartItem,
	checkout,
	clearCart,
	fetchCart,
	login,
	register,
	removeCartItem,
	updateCartItem
} from '../services/api'
import '../styles/Layout.css'

function App() {
	const [cart, setCart] = useState([])
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
	const [auth, setAuth] = useState(() => {
		const savedAuth = localStorage.getItem('auth')
		return savedAuth ? JSON.parse(savedAuth) : null
	})
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [authError, setAuthError] = useState('')
	const [cartError, setCartError] = useState('')
	const [isLoadingCart, setIsLoadingCart] = useState(false)
	const [isCheckingOut, setIsCheckingOut] = useState(false)

	const token = auth?.token

	useEffect(() => {
		if (auth) {
			localStorage.setItem('auth', JSON.stringify(auth))
		} else {
			localStorage.removeItem('auth')
		}
	}, [auth])

	useEffect(() => {
		let isCancelled = false

		async function loadCart() {
			if (!token) {
				setCart([])
				return
			}

			setIsLoadingCart(true)
			setCartError('')
			try {
				const payload = await fetchCart(token)
				if (!isCancelled) {
					setCart(payload.items)
				}
			} catch (error) {
				if (!isCancelled) {
					setCartError(error.message)
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingCart(false)
				}
			}
		}

		loadCart()

		return () => {
			isCancelled = true
		}
	}, [token])

	async function handleAuth(mode) {
		setAuthError('')
		const normalizedEmail = email.trim().toLowerCase()
		const normalizedPassword = password.trim()

		if (!normalizedEmail || !normalizedPassword) {
			setAuthError('Email et mot de passe sont obligatoires.')
			return
		}

		try {
			const payload =
				mode === 'register'
					? await register({ email: normalizedEmail, password: normalizedPassword })
					: await login({ email: normalizedEmail, password: normalizedPassword })
			setAuth(payload)
			setIsAuthModalOpen(false)
		} catch (error) {
			setAuthError(error.message)
		}
	}

	async function handleAddToCart(plantId, plantName) {
		if (!token) {
			setCartError('Connectez-vous pour ajouter des plantes au panier.')
			return
		}

		if (!plantId && !plantName) {
			setCartError('Impossible d identifier la plante a ajouter.')
			return
		}

		setCartError('')
		try {
			const payload = await addCartItem(token, plantId, 1, plantName)
			setCart(payload.items)
		} catch (error) {
			setCartError(error.message)
		}
	}

	async function handleClearCart() {
		if (!token) {
			return
		}

		try {
			const payload = await clearCart(token)
			setCart(payload.items)
		} catch (error) {
			setCartError(error.message)
		}
	}

	async function handleUpdateQuantity(plantId, amount) {
		if (!token) {
			return
		}

		if (amount <= 0) {
			await handleRemoveItem(plantId)
			return
		}

		try {
			const payload = await updateCartItem(token, plantId, amount)
			setCart(payload.items)
		} catch (error) {
			setCartError(error.message)
		}
	}

	async function handleRemoveItem(plantId) {
		if (!token) {
			return
		}

		try {
			const payload = await removeCartItem(token, plantId)
			setCart(payload.items)
		} catch (error) {
			setCartError(error.message)
		}
	}

	async function handleCheckout() {
		if (!token || cart.length === 0) {
			return
		}

		setIsCheckingOut(true)
		setCartError('')
		try {
			await checkout(token)
			setCart([])
		} catch (error) {
			setCartError(error.message)
		} finally {
			setIsCheckingOut(false)
		}
	}

	function handleLogout() {
		setAuth(null)
		setCart([])
		setCartError('')
	}

	return (
		<div className='lmj-app'>
			<Banner>
				<img src={logo} alt='logo-la-maison-jungle' className='lmj-logo' />
				<div>
					<h1 className='lmj-title'>La maison jungle</h1>
					<p className='lmj-subtitle'>Boutique botanique pour votre interieur</p>
					<div className='lmj-hero-actions'>
						<button className='lmj-get-started' onClick={() => setIsAuthModalOpen(true)}>
							Get started
						</button>
						{auth ? (
							<button className='lmj-ghost-button' onClick={handleLogout}>
								Deconnexion
							</button>
						) : null}
					</div>
					{auth ? <small>Connecte: {auth.user.email}</small> : null}
					{cartError ? <small className='lmj-error'>{cartError}</small> : null}
				</div>
			</Banner>
			{isAuthModalOpen ? (
				<div className='lmj-modal-backdrop' onClick={() => setIsAuthModalOpen(false)}>
					<div className='lmj-modal' onClick={(event) => event.stopPropagation()}>
						<div className='lmj-modal-header'>
							<h2>Connexion / Inscription</h2>
							<button className='lmj-modal-close' onClick={() => setIsAuthModalOpen(false)}>
								×
							</button>
						</div>
						<p>Crée ton compte avec un nouvel email ou connecte-toi.</p>
						<div className='lmj-auth-panel'>
							<input
								type='email'
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder='email'
							/>
							<input
								type='password'
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder='mot de passe'
							/>
							<div className='lmj-auth-actions'>
								<button onClick={() => handleAuth('login')}>Connexion</button>
								<button onClick={() => handleAuth('register')}>Inscription</button>
							</div>
						</div>
						{authError ? <small className='lmj-error'>{authError}</small> : null}
					</div>
				</div>
			) : null}
			<div className='lmj-layout-inner'>
				<Cart
					cart={cart}
					onClearCart={handleClearCart}
					onUpdateQuantity={handleUpdateQuantity}
					onRemoveItem={handleRemoveItem}
					onCheckout={handleCheckout}
					isLoading={isLoadingCart}
					isCheckingOut={isCheckingOut}
				/>
				<ShoppingList onAddToCart={handleAddToCart} />
			</div>
			<Footer />
		</div>
	)
}

export default App