import CareScale from './CareScale'
import '../styles/PlantItem.css'

function PlantItem({ cover, name, water, light, price }) {
	return (
		<article className='lmj-plant-item'>
			<span className='lmj-plant-item-price'>{price}€</span>
			<img className='lmj-plant-item-cover' src={cover} alt={`${name} cover`} />
			<strong>{name}</strong>
			<div>
				<CareScale careType='water' scaleValue={water} />
				<CareScale careType='light' scaleValue={light} />
			</div>
		</article>
	)
}

export default PlantItem