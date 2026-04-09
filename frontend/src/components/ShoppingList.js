import { useEffect, useState } from 'react'
import { plantList } from '../datas/PlantList'
import PlantItem from './PlantItem'
import Categories from './Categories'
import { fetchPlants } from '../services/api'
import { resolvePlantCover } from '../utils/plantCover'
import '../styles/ShoppingList.css'

function ShoppingList({ cart, updateCart }) {
	const [activeCategory, setActiveCategory] = useState('')
	const [plants, setPlants] = useState(plantList)
	const [isLoading, setIsLoading] = useState(true)
	const [apiError, setApiError] = useState('')

	useEffect(() => {
		let isCancelled = false

		async function loadPlants() {
			try {
				const apiPlants = await fetchPlants()
				if (!isCancelled && Array.isArray(apiPlants) && apiPlants.length > 0) {
					setPlants(apiPlants)
					setApiError('')
				}
			} catch (error) {
				if (!isCancelled) {
					setApiError('API indisponible: affichage des donnees locales.')
					setPlants(plantList)
				}
			} finally {
				if (!isCancelled) {
					setIsLoading(false)
				}
			}
		}

		loadPlants()

		return () => {
			isCancelled = true
		}
	}, [])

	const categories = plants.reduce(
		(acc, elem) =>
			acc.includes(elem.category) ? acc : acc.concat(elem.category),
		[]
	)

	function addToCart(name, price) {
		const currentPlantAdded = cart.find((plant) => plant.name === name)
		if (currentPlantAdded) {
			const cartFilteredCurrentPlant = cart.filter(
				(plant) => plant.name !== name
			)
			updateCart([
				...cartFilteredCurrentPlant,
				{ name, price, amount: currentPlantAdded.amount + 1 }
			])
		} else {
			updateCart([...cart, { name, price, amount: 1 }])
		}
	}

	return (
		<div className='lmj-shopping-list'>
			<div className='lmj-shopping-header'>
				<h2>Notre collection</h2>
				<p>{plants.length} plantes disponibles</p>
				{isLoading ? <small>Chargement du catalogue...</small> : null}
				{apiError ? <small>{apiError}</small> : null}
			</div>
			<Categories
				categories={categories}
				setActiveCategory={setActiveCategory}
				activeCategory={activeCategory}
			/>

			<ul className='lmj-plant-list'>
				{plants.map(({ id, cover, name, water, light, price, category }) =>
					!activeCategory || activeCategory === category ? (
						<li key={id} className='lmj-plant-card'>
							<PlantItem
								cover={resolvePlantCover(cover)}
								name={name}
								water={water}
								light={light}
								price={price}
							/>
							<button
								className='lmj-add-button'
								onClick={() => addToCart(name, price)}
							>
								Ajouter au panier
							</button>
						</li>
					) : null
				)}
			</ul>
		</div>
	)
}

export default ShoppingList