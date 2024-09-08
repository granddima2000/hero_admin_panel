import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';

import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';

const HeroesList = () => {
    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then((data) => console.log(data, 'delete'))
            .then(dispatch(heroDeleted(id)))
        // eslint-disable-next-line
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    } // Если эти 2 условия не выполнились, то код идет дальше

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition in={true} timeout={500} classNames={'item'}>
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }
        
        return arr.map(({id, ...props}) => {
            return (
                    <CSSTransition in={true} key={id} timeout={500} classNames={'item'}>
                        <HeroesListItem key={id} {...props} onDelete={() => onDelete(id)}/>
                    </CSSTransition>
            );
        });
    }
    
    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            <TransitionGroup component={null}>
                {elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;