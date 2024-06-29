import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUser } from "../features/userSlice";
import moto_image from "../images/mototure0.png";

import { CardRuta } from "../components/CardRuta";

import { Link } from "react-router-dom";
import { Routes } from "../router";
import { FaRegUser, FaPlus, FaArrowCircleUp, FaSearch } from "react-icons/fa";
import { openModal } from "../features/modalSlice";

import "../CSS/Home.scss";

const Home = () => {
  const [top_button, setButtonTop] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const buttonAppear = () => {
    if (window.scrollY >= 100) {
      setButtonTop(true);
    } else {
      setButtonTop(false);
    }
  };

  window.addEventListener("scroll", buttonAppear);
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOpenModal = (type) => {
    dispatch(openModal(type));
  };

  return (
    <div className="home">
      <div className=" d-flex justify-content-center px-3 pt-2 pb-5">
        <button
          onClick={scrollTop}
          className={top_button ? "top_button" : "top_button hide"}
        >
          <FaArrowCircleUp size="34px" />
        </button>

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
        <h2>Ultimele ture</h2>

        <div className="row">
          {[1, 2, 3].map((item, index) => {
            return index === 0 ? (
              <div
                key={index}
                className="special_route col-12 col-lg-6 px-3 pt-2"
              >
                <CardRuta key={index} isSpecial={index === 0 ? true : false} />
              </div>
            ) : null;
          })}

          <div className="col-12 col-lg-6 px-3 pb-5">
            {[1, 2, 3].map((item, index) => {
              return index !== 0 ? (
                <div key={index} className="pt-2">
                  <CardRuta
                    key={index}
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
