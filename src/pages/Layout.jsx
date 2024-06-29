import { useEffect } from "react";

import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { Modal } from "../components/Modal";
import { Autentificare } from "../components/Autentificare";
import { Inregistrare } from "../components/Inregistrare";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { closeModal, openModal } from "../features/modalSlice";
import { setUser } from "../features/userSlice";

const Layout = () => {
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  // const isLoading = false;
  // if (isLoading) {
  //   return <div>isLoading</div>;
  // }

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
      <Outlet />
      <Footer />

      <Modal>
        {modal.type === "register" ? <Inregistrare /> : null}

        {modal.type === "login" ? <Autentificare /> : null}

        {modal.type === "register" || modal.type === "login" ? (
          <div>
            <button onClick={() => handleOpenModal("register")}>
              Inregistre
            </button>
            <button onClick={() => handleOpenModal("login")}>
              Autentificare
            </button>
            <button onClick={handleCloseModal}>Close Modal</button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Layout;
