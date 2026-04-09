import basil from '../assets/basil.jpg'
import cactus from '../assets/cactus.jpg'
import calathea from '../assets/calathea.jpg'
import lyrata from '../assets/lyrata.jpg'
import mint from '../assets/mint.jpg'
import monstera from '../assets/monstera.jpg'
import olivier from '../assets/olivier.jpg'
import pothos from '../assets/pothos.jpg'
import succulent from '../assets/succulent.jpg'

const coverMap = {
	basil,
	cactus,
	calathea,
	lyrata,
	mint,
	monstera,
	olivier,
	pothos,
	succulent
}

export function resolvePlantCover(cover) {
	if (typeof cover !== 'string') {
		return cover
	}
	return coverMap[cover] || cover
}
