import { useEffect, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { Modal } from "../components/Modal";
import { Autentificare } from "../components/Autentificare";
import { Inregistrare } from "../components/Inregistrare";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { closeModal, openModal } from "../features/modalSlice";
import { setUser } from "../features/userSlice";

import "../CSS/Layout.scss";

const Layout = () => {
  const [top_button, setButtonTop] = useState(false);
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser());
  }, [dispatch]);

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

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleOpenModal = (type) => {
    dispatch(openModal(type));
  };

  useEffect(() => {
    dispatch(setUser());
  }, []);

  return (
    <div>
      <Navbar />
      <button
        onClick={scrollTop}
        className={top_button ? "top_button" : "top_button hide"}
      >
        <FaArrowCircleUp size="34px" />
      </button>
      <Outlet />
      <Footer />

      <Modal>
        {modal.type === "register" ? <Inregistrare /> : null}

        {modal.type === "login" ? <Autentificare /> : null}

        {modal.type === "register" || modal.type === "login" ? (
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-9">
                  <button
                    className="modal_button me-2 mt-5"
                    onClick={() => handleOpenModal("register")}
                  >
                    Creaza cont
                  </button>
                  <button
                    className="modal_button me-2 mt-5"
                    onClick={() => handleOpenModal("login")}
                  >
                    Autentificare
                  </button>
                </div>
                <div className="col-3">
                  <button
                    className="modal_button me-2 mt-5"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Layout;
