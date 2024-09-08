import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import store from "../../store";

import { actionFilterChanged, fetchFilters, selectAll } from "./filtersSlice";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
  const { filtersLoadingStatus, activeFilter } = useSelector(
    (state) => state.filters
  );
  const filters = selectAll(store.getState());
  console.log(filters);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchFilters(request));
    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === "loading") {
    return (
      <h5 className="text-center mt-5">
        <Spinner />
      </h5>
    );
  } else if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  } // Если эти 2 условия не выполнились, то код идет дальше

  const renderFilters = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
    }

    return arr.map(({ name, label, className }) => {
      const btnClass = classNames("btn", className, {
        active: name === activeFilter,
      });

      return (
        <button
          className={btnClass}
          key={name}
          id={name}
          onClick={() => dispatch(actionFilterChanged(name))}
        >
          {label}
        </button>
      );
    });
  };

  const elements = renderFilters(filters);
  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{elements}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
