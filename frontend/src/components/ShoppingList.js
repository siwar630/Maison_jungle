import { useEffect, useState } from 'react'
import { plantList } from '../datas/PlantList'
import PlantItem from './PlantItem'
import Categories from './Categories'
import { fetchPlants } from '../services/api'
import { resolvePlantCover } from '../utils/plantCover'
import '../styles/ShoppingList.css'

function ShoppingList({ onAddToCart }) {
	const [activeCategory, setActiveCategory] = useState('')
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [plants, setPlants] = useState(plantList)
	const [isLoading, setIsLoading] = useState(true)
	const [apiError, setApiError] = useState('')

	useEffect(() => {
		let isCancelled = false

		async function loadPlants() {
			try {
				const payload = await fetchPlants({
					search,
					category: activeCategory,
					page,
					pageSize: 6
				})
				if (!isCancelled && Array.isArray(payload.items)) {
					setPlants(payload.items)
					setTotalPages(payload.totalPages || 1)
					setApiError('')
				}
			} catch (error) {
				if (!isCancelled) {
					setApiError('API indisponible: affichage des donnees locales.')
					const fallback = plantList.filter(
						(plant) =>
							(!activeCategory || plant.category === activeCategory) &&
							(!search ||
								plant.name.toLowerCase().includes(search.toLowerCase()))
					)
					setPlants(fallback)
					setTotalPages(1)
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
	}, [activeCategory, search, page])

	const categories = plants.reduce(
		(acc, elem) =>
			acc.includes(elem.category) ? acc : acc.concat(elem.category),
		[]
	)

	function handleCategoryChange(category) {
		setActiveCategory(category)
		setPage(1)
	}

	return (
		<div className='lmj-shopping-list'>
			<div className='lmj-shopping-header'>
				<h2>Notre collection</h2>
				<p>{plants.length} plantes disponibles</p>
				{isLoading ? <small>Chargement du catalogue...</small> : null}
				{apiError ? <small>{apiError}</small> : null}
				<input
					className='lmj-search-input'
					type='search'
					placeholder='Rechercher une plante'
					value={search}
					onChange={(event) => {
						setSearch(event.target.value)
						setPage(1)
					}}
				/>
			</div>
			<Categories
				categories={categories}
				setActiveCategory={handleCategoryChange}
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
								onClick={() => onAddToCart(id, name)}
							>
								Ajouter au panier
							</button>
						</li>
					) : null
				)}
			</ul>
			<div className='lmj-pagination'>
				<button
					onClick={() => setPage((prev) => Math.max(1, prev - 1))}
					disabled={page <= 1}
				>
					Precedent
				</button>
				<span>
					Page {page} / {totalPages}
				</span>
				<button
					onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
					disabled={page >= totalPages}
				>
					Suivant
				</button>
			</div>
		</div>
	)
}

export default ShoppingList