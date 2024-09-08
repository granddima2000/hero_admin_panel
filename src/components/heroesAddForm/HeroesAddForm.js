import { useHttp } from "../../hooks/http.hook";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import store from "../../store";

import { selectAll } from "../heroesFilters/filtersSlice";
import { heroCreated } from "../heroesList/heroesSlice";

const HeroesAddForm = () => {
  //   const [heroName, setHeroName] = useState("");
  //   const [heroDescr, setHeroDescr] = useState("");
  //   const [heroElement, setHeroElement] = useState("");

  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = selectAll(store.getState());
  const dispatch = useDispatch();
  const { request } = useHttp();

  //   const onSubmitHandler = (e) => {
  //     e.preventDefault();

  //     const newHero = {
  //       id: uuidv4(),
  //       name: heroName,
  //       description: heroDescr,
  //       element: heroElement,
  //     };

  //     request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
  //       .then((res) => console.log(res, "Отправка успешна"))
  //       .then(dispatch(heroCreated(newHero)))
  //       .catch((err) => console.log(err));

  //     setHeroName("");
  //     setHeroDescr("");
  //     setHeroElement("");
  //   };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    } else if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name === "all") {
          return null;
        }

        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <Formik
      initialValues={{
        heroName: "",
        heroDescr: "",
        heroElement: "",
      }}
      validationSchema={yup.object({
        heroName: yup
          .string()
          .min(2, "Минимум 2 символа")
          .required("Обязательное для заполнения"),
        heroDescr: yup
          .string()
          .min(10, "Минимум 10 символов")
          .required("Обязательное для заполнения"),
        heroElement: yup.string().required("Выберите элемент!"),
      })}
      onSubmit={(values, { resetForm }) => {
        const newHero = {
          id: uuidv4(),
          name: values.heroName,
          description: values.heroDescr,
          element: values.heroElement,
        };
        // console.log(JSON.stringify(values, null, 2));

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
          .then((res) => console.log(res, "Отправка успешна"))
          .then(dispatch(heroCreated(newHero)))
          .catch((err) => console.log(err));

        resetForm();
      }}
    >
      <Form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
          <label htmlFor="heroName" className="form-label fs-4">
            Имя нового героя
          </label>
          <Field
            required
            type="text"
            name="heroName"
            className="form-control"
            id="heroName"
            placeholder="Как меня зовут?"
          />
          <ErrorMessage className="error" name="heroName" component="div" />
        </div>

        <div className="mb-3">
          <label htmlFor="heroDescr" className="form-label fs-4">
            Описание
          </label>
          <Field
            required
            name="heroDescr"
            className="form-control"
            id="heroDescr"
            placeholder="Что я умею?"
            style={{ height: "130px" }}
            as="textarea"
          />
          <ErrorMessage className="error" name="heroDescr" component="div" />
        </div>

        <div className="mb-3">
          <label htmlFor="heroElement" className="form-label">
            Выбрать элемент героя
          </label>
          <Field
            required
            className="form-select"
            id="heroElement"
            name="heroElement"
            as="select"
          >
            <option>Я владею элементом...</option>
            {renderFilters(filters, filtersLoadingStatus)}
          </Field>
          <ErrorMessage className="error" name="heroElement" component="div" />
        </div>

        <button type="submit" className="btn btn-primary">
          Создать
        </button>
      </Form>
    </Formik>
  );
};

export default HeroesAddForm;
