import { useState, useEffect } from 'react'
import Banner from './Banner'
import logo from '../assets/logo.png'
import Cart from './Cart'
import Footer from './Footer'
import ShoppingList from './ShoppingList'
import OrdersPanel from './OrdersPanel'
import {
	addCartItem,
	cancelOrder,
	checkout,
	clearCart,
	fetchCart,
	fetchCurrentUser,
	fetchOrders,
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
	const [confirmPassword, setConfirmPassword] = useState('')
	const [authMode, setAuthMode] = useState('login')
	const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [authError, setAuthError] = useState('')
	const [cartError, setCartError] = useState('')
	const [isLoadingCart, setIsLoadingCart] = useState(false)
	const [isCheckingOut, setIsCheckingOut] = useState(false)
	const [orders, setOrders] = useState([])
	const [isLoadingOrders, setIsLoadingOrders] = useState(false)
	const [isCancellingOrder, setIsCancellingOrder] = useState(false)
	const [ordersError, setOrdersError] = useState('')

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

		async function refreshSession() {
			if (!token) {
				return false
			}

			try {
				const payload = await fetchCurrentUser(token)
				if (!isCancelled && payload.user) {
					setAuth((previousAuth) => ({
						...(previousAuth || {}),
						token,
						user: payload.user
					}))
				}
				return true
			} catch (_error) {
				if (!isCancelled) {
					setAuth(null)
					setCart([])
					setCartError('Session expiree. Merci de vous reconnecter.')
				}
				return false
			}
		}

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

		async function loadOrders() {
			if (!token) {
				setOrders([])
				return
			}

			setIsLoadingOrders(true)
			setOrdersError('')
			try {
				const payload = await fetchOrders(token)
				if (!isCancelled) {
					setOrders(payload.items || [])
				}
			} catch (error) {
				if (!isCancelled) {
					setOrdersError(error.message)
				}
			} finally {
				if (!isCancelled) {
					setIsLoadingOrders(false)
				}
			}
		}

		refreshSession().then((isSessionValid) => {
			if (!isCancelled && isSessionValid) {
				loadCart()
				loadOrders()
			}
		})

		return () => {
			isCancelled = true
		}
	}, [token])

	function resetAuthForm() {
		setEmail('')
		setPassword('')
		setConfirmPassword('')
		setShowPassword(false)
		setAuthError('')
	}

	function openAuthModal(mode = 'login') {
		setAuthMode(mode)
		setIsAuthModalOpen(true)
		setAuthError('')
	}

	function closeAuthModal() {
		setIsAuthModalOpen(false)
		resetAuthForm()
	}

	async function handleAuthSubmit(event) {
		event.preventDefault()
		setAuthError('')
		const normalizedEmail = email.trim().toLowerCase()
		const normalizedPassword = password.trim()
		const normalizedConfirmPassword = confirmPassword.trim()

		if (!normalizedEmail || !normalizedPassword) {
			setAuthError('Email et mot de passe sont obligatoires.')
			return
		}

		if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
			setAuthError('Format email invalide.')
			return
		}

		if (authMode === 'register') {
			if (normalizedPassword.length < 8) {
				setAuthError('Le mot de passe doit contenir au moins 8 caracteres.')
				return
			}

			if (!/[A-Za-z]/.test(normalizedPassword) || !/[0-9]/.test(normalizedPassword)) {
				setAuthError('Le mot de passe doit contenir au moins une lettre et un chiffre.')
				return
			}

			if (normalizedPassword !== normalizedConfirmPassword) {
				setAuthError('Les mots de passe ne correspondent pas.')
				return
			}
		}

		try {
			setIsSubmittingAuth(true)
			const payload =
				authMode === 'register'
					? await register({ email: normalizedEmail, password: normalizedPassword })
					: await login({ email: normalizedEmail, password: normalizedPassword })
			setAuth(payload)
			closeAuthModal()
		} catch (error) {
			setAuthError(error.message)
		} finally {
			setIsSubmittingAuth(false)
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
			await handleRefreshOrders()
		} catch (error) {
			setCartError(error.message)
		} finally {
			setIsCheckingOut(false)
		}
	}

	async function handleRefreshOrders() {
		if (!token) {
			return
		}

		setOrdersError('')
		setIsLoadingOrders(true)
		try {
			const payload = await fetchOrders(token)
			setOrders(payload.items || [])
		} catch (error) {
			setOrdersError(error.message)
		} finally {
			setIsLoadingOrders(false)
		}
	}

	async function handleCancelOrder(orderId) {
		if (!token) {
			return
		}

		setOrdersError('')
		setIsCancellingOrder(true)
		try {
			await cancelOrder(token, orderId)
			await handleRefreshOrders()
		} catch (error) {
			setOrdersError(error.message)
		} finally {
			setIsCancellingOrder(false)
		}
	}

	function handleLogout() {
		setAuth(null)
		setCart([])
		setOrders([])
		setCartError('')
		setOrdersError('')
		resetAuthForm()
	}

	return (
		<div className='lmj-app'>
			<Banner>
				<img src={logo} alt='logo-la-maison-jungle' className='lmj-logo' />
				<div>
					<h1 className='lmj-title'>La maison jungle</h1>
					<p className='lmj-subtitle'>Boutique botanique pour votre interieur</p>
					<div className='lmj-hero-actions'>
						<button className='lmj-get-started' onClick={() => openAuthModal('login')}>
							Get started
						</button>
						{!auth ? (
							<button className='lmj-ghost-button' onClick={() => openAuthModal('register')}>
								Inscription
							</button>
						) : null}
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
				<div className='lmj-modal-backdrop' onClick={closeAuthModal}>
					<div className='lmj-modal' onClick={(event) => event.stopPropagation()}>
						<div className='lmj-modal-header'>
							<h2>{authMode === 'login' ? 'Connexion' : 'Inscription'}</h2>
							<button className='lmj-modal-close' onClick={closeAuthModal}>
								×
							</button>
						</div>
						<p>Accede a ton espace pour gerer ton panier et commander en quelques clics.</p>
						<div className='lmj-auth-switch' role='tablist' aria-label='Choix mode authentification'>
							<button
								type='button'
								className={authMode === 'login' ? 'is-active' : ''}
								onClick={() => setAuthMode('login')}
							>
								Connexion
							</button>
							<button
								type='button'
								className={authMode === 'register' ? 'is-active' : ''}
								onClick={() => setAuthMode('register')}
							>
								Inscription
							</button>
						</div>
						<form className='lmj-auth-panel' onSubmit={handleAuthSubmit}>
							<label htmlFor='auth-email'>Adresse email</label>
							<input
								id='auth-email'
								type='email'
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder='email'
								autoComplete='email'
							/>
							<label htmlFor='auth-password'>Mot de passe</label>
							<input
								id='auth-password'
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder='mot de passe'
								autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
							/>
							{authMode === 'register' ? (
								<>
									<label htmlFor='auth-confirm-password'>Confirmer le mot de passe</label>
									<input
										id='auth-confirm-password'
										type={showPassword ? 'text' : 'password'}
										value={confirmPassword}
										onChange={(event) => setConfirmPassword(event.target.value)}
										placeholder='confirmation'
										autoComplete='new-password'
									/>
								</>
							) : null}
							<label className='lmj-password-toggle'>
								<input
									type='checkbox'
									checked={showPassword}
									onChange={(event) => setShowPassword(event.target.checked)}
								/>
								Afficher le mot de passe
							</label>
							<div className='lmj-auth-actions'>
								<button type='submit' disabled={isSubmittingAuth}>
									{isSubmittingAuth
										? 'Traitement...'
										: authMode === 'login'
											? 'Connexion'
											: 'Creer mon compte'}
								</button>
							</div>
						</form>
						{authError ? <small className='lmj-error'>{authError}</small> : null}
					</div>
				</div>
			) : null}
			<div className='lmj-layout-inner'>
				<div className='lmj-side-panel'>
					<Cart
						cart={cart}
						onClearCart={handleClearCart}
						onUpdateQuantity={handleUpdateQuantity}
						onRemoveItem={handleRemoveItem}
						onCheckout={handleCheckout}
						isLoading={isLoadingCart}
						isCheckingOut={isCheckingOut}
					/>
					<OrdersPanel
						orders={orders}
						onRefresh={handleRefreshOrders}
						onCancel={handleCancelOrder}
						isLoading={isLoadingOrders}
						isCancelling={isCancellingOrder}
						error={ordersError}
						disabled={!token}
					/>
				</div>
				<ShoppingList onAddToCart={handleAddToCart} />
			</div>
			<Footer />
		</div>
	)
}

export default App