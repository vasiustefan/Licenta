import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { Routes } from "../router";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { signOutUser } from "../features/userSlice";
import { openModal } from "../features/modalSlice";

import { FaRegUser, FaPlus, FaRoute } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";

import "../CSS/Navbar.scss";

export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(signOutUser());
  };

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleOpenModal = (type) => {
    dispatch(openModal(type));
  };

  return (
    <div className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link to={Routes.Home}>
          <img src={logo} alt="MTRoutes" className="navbar-logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleMenu}
        >
          <RxHamburgerMenu className="fs-1" />
        </button>
        <div
          className={`collapse navbar-collapse justify-content-end ${
            showMenu ? "show" : ""
          }`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav">
            <li className="nav-item p-1 m-1">
              <div className="btn btn-outline-danger mt-2">
                <FaRoute className="me-2" />
                <Link to={Routes.ListaTure}>Ture</Link>
              </div>
            </li>
            {user === null ? (
              <>
                <li className="nav-item p-1 m-1">
                  <button
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2"
                    onClick={() => handleOpenModal("login")}
                  >
                    <FaRegUser className="me-2" />
                    Autentificare
                  </button>
                </li>
                <li className="nav-item p-1 m-1">
                  <button
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2"
                    onClick={() => handleOpenModal("register")}
                  >
                    <FaPlus className="me-2" />
                    Inregistrare
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item p-1 m-1">
                  <button className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2">
                    <Link to={Routes.AdaugaTure}>
                      <FaPlus className="me-2" /> Adauga ruta
                    </Link>
                  </button>
                </li>
                <li className="nav-item p-1 m-1">
                  <button
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2"
                    onClick={handleLogout}
                  >
                    <CiLogout className="me-2" />
                    <Link to={Routes.Home}>Deconectare</Link>
                  </button>
                </li>
                <li className="nav-item p-1 m-1">
                  <button className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2">
                    <MdAccountCircle className="me-2" />
                    <Link to={Routes.ContulMeu}>Contul meu</Link>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
