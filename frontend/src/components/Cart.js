import { useState, useEffect } from 'react'
import '../styles/Cart.css'

function Cart({
	cart,
	onClearCart,
	onUpdateQuantity,
	onRemoveItem,
	onCheckout,
	isLoading,
	isCheckingOut
}) {
	const [isOpen, setIsOpen] = useState(true)
	const total = cart.reduce(
		(acc, plantType) => acc + plantType.amount * plantType.price,
		0
	)
	useEffect(() => {
		document.title = `LMJ: ${total}€ d'achats`
	}, [total])

	return isOpen ? (
		<div className='lmj-cart'>
			<button
				className='lmj-cart-toggle-button'
				onClick={() => setIsOpen(false)}
			>
				Masquer
			</button>
			{isLoading ? <div className='lmj-empty-cart'>Chargement du panier...</div> : null}
			{cart.length > 0 ? (
				<div className='lmj-cart-content'>
					<h2>Panier</h2>
					<ul className='lmj-cart-list'>
						{cart.map(({ plantId, name, price, amount }) => (
							<li key={plantId} className='lmj-cart-item'>
								<span>{name}</span>
								<div className='lmj-cart-item-actions'>
									<button onClick={() => onUpdateQuantity(plantId, amount - 1)}>
										-
									</button>
									<span>
										{amount} x {price}€
									</span>
									<button onClick={() => onUpdateQuantity(plantId, amount + 1)}>
										+
									</button>
									<button onClick={() => onRemoveItem(plantId)}>x</button>
								</div>
							</li>
						))}
					</ul>
					<h3 className='lmj-cart-total'>Total : {total}€</h3>
					<button className='lmj-clear-cart' onClick={onClearCart}>
						Vider le panier
					</button>
					<button
						className='lmj-clear-cart'
						onClick={onCheckout}
						disabled={isCheckingOut}
					>
						{isCheckingOut ? 'Paiement...' : 'Valider la commande'}
					</button>
				</div>
			) : (
				<div className='lmj-empty-cart'>Votre panier est vide</div>
			)}
		</div>
	) : (
		<div className='lmj-cart-closed'>
			<button
				className='lmj-cart-toggle-button'
				onClick={() => setIsOpen(true)}
			>
				Afficher le panier
			</button>
		</div>
	)
}

export default Cart