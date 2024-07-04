/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "../app/hooks";
import moto_image from "../images/mototure0.png";

import { CardRuta } from "../components/CardRuta";

import { Link } from "react-router-dom";
import { Routes } from "../router";
import { FaRegUser, FaPlus, FaSearch } from "react-icons/fa";
import { openModal } from "../features/modalSlice";

import { useEffect } from "react";
import { fetchAllTure } from "../features/tureSlice";

import "../CSS/Home.scss";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { ture } = useAppSelector((state) => state.ture);

  const handleOpenModal = (type) => {
    dispatch(openModal(type));
  };

  useEffect(() => {
    dispatch(fetchAllTure());
  }, []);

  return (
    <div className="home">
      <div className="d-flex justify-content-center px-3 pt-2 pb-5">
        <div className=" row align-items-center home-info">
          <div className="col-12 col-lg-5">
            <h1 className="display-4 fw-bold mb-4">
              Planifică povești pe 2 roți
            </h1>
            <p>
              Crează trasee uimitoare și transformă fiecare călătorie într-o
              experiență de neuitat.
            </p>
            <p>
              Descoperă noi destinații, conectează-te cu alți pasionați de
              motociclism și pornește în călătorii memorabile!
            </p>

            <div className={!user ? "intro__buttons" : " d-none"}>
              <button onClick={() => handleOpenModal("login")}>
                <FaRegUser className="me-2" /> Autentificare
              </button>
              <button onClick={() => handleOpenModal("register")}>
                <FaPlus className="me-2" /> Inregistrare
              </button>
            </div>

            <div className={user ? "intro__buttons" : " d-none"}>
              <Link to={Routes.Ture}>
                <FaSearch className="me-2" /> Cauta Rute
              </Link>
              <Link to={Routes.AdaugaTure}>
                <FaPlus className="me-2" /> Adauga ruta
              </Link>
            </div>
          </div>
          <div className="d-none d-lg-flex col-lg-7 justify-content-center">
            <img className="moto_img" src={moto_image} alt="moto" />
          </div>
        </div>
      </div>
      <div className="px-3 pt-2 pb-5 last_routes">
        <h2>Cele mai recente ture</h2>

        <div className="row">
          {ture.map((route, index) => {
            return index === 0 ? (
              <div
                key={route.id}
                className="special_route col-12 col-lg-6 px-3 pt-2"
              >
                <CardRuta
                  key={route.id}
                  route={route}
                  isSpecial={index === 0 ? true : false}
                />
              </div>
            ) : null;
          })}

          <div className="col-12 col-lg-6 px-3 pb-5">
            {ture.map((route, index) => {
              return index !== 0 && index <= 2 ? (
                <div key={route.id} className="pt-2">
                  <CardRuta
                    key={route.id}
                    route={route}
                    isSpecial={index === 0 ? true : false}
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
