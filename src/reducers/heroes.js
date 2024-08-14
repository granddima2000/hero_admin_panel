const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle',
}

const heroes = (state = initialState, action) => {
	switch (action.type) {
			case 'HEROES_FETCHING': // фетчим
					return {
							...state,
							heroesLoadingStatus: 'loading'
					}
			case 'HEROES_FETCHED': // Получили
					return {
							...state,
							heroes: action.payload, // То что приходит от сервера
							heroesLoadingStatus: 'idle'
					}
			case 'HEROES_FETCHING_ERROR':
					return {
							...state,
							heroesLoadingStatus: 'error'
					}
			case 'HERO_CREATED':
					return {
							...state,
							heroes: [...state.heroes, action.payload],
							
					}
			case 'HERO_DELETE':
					return {
							...state,
							heroes: state.heroes.filter(item => item.id !== action.payload),
					}	
			default: return state
	}
}

export default heroes;