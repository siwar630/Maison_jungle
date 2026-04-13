import '../styles/OrdersPanel.css'

function formatCurrency(value) {
	return `${Number(value).toFixed(2)} EUR`
}

function formatDate(value) {
	return new Date(value).toLocaleString('fr-FR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

function OrdersPanel({
	orders,
	onRefresh,
	onCancel,
	isLoading,
	isCancelling,
	error,
	disabled
}) {
	return (
		<section className='lmj-orders-panel'>
			<div className='lmj-orders-head'>
				<div>
					<h2>Mes commandes</h2>
					<p>Suivez vos commandes et leur statut en temps reel.</p>
				</div>
				<button type='button' onClick={onRefresh} disabled={disabled || isLoading}>
					{isLoading ? 'Actualisation...' : 'Actualiser'}
				</button>
			</div>
			{error ? <small className='lmj-orders-error'>{error}</small> : null}
			{orders.length === 0 && !isLoading ? (
				<div className='lmj-orders-empty'>Aucune commande pour le moment.</div>
			) : null}
			<ul className='lmj-orders-list'>
				{orders.map((order) => (
					<li key={order.id} className='lmj-order-card'>
						<div className='lmj-order-row'>
							<strong>#{order.id.slice(0, 8)}</strong>
							<span className={`lmj-order-badge is-${order.status}`}>
								{order.status}
							</span>
						</div>
						<p className='lmj-order-date'>{formatDate(order.createdAt)}</p>
						<ul className='lmj-order-items'>
							{order.items.map((item) => (
								<li key={item.id}>
									<span>{item.name}</span>
									<span>
										{item.quantity} x {formatCurrency(item.unitPrice)}
									</span>
								</li>
							))}
						</ul>
						<div className='lmj-order-footer'>
							<span>Total</span>
							<strong>{formatCurrency(order.total)}</strong>
						</div>
						{order.status === 'placed' ? (
							<button
								type='button'
								onClick={() => onCancel(order.id)}
								disabled={disabled || isCancelling}
							>
								{isCancelling ? 'Annulation...' : 'Annuler la commande'}
							</button>
						) : null}
					</li>
				))}
			</ul>
		</section>
	)
}

export default OrdersPanel
