import { useState, useEffect } from 'react'
import '../styles/Cart.css'

function Cart({ cart, updateCart }) {
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
			{cart.length > 0 ? (
				<div className='lmj-cart-content'>
					<h2>Panier</h2>
					<ul className='lmj-cart-list'>
						{cart.map(({ name, price, amount }, index) => (
							<li key={`${name}-${index}`} className='lmj-cart-item'>
								<span>{name}</span>
								<span>
									{amount} x {price}€
								</span>
							</li>
						))}
					</ul>
					<h3 className='lmj-cart-total'>Total : {total}€</h3>
					<button className='lmj-clear-cart' onClick={() => updateCart([])}>
						Vider le panier
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