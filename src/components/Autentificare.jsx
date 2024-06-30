import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { signInUser } from "../features/userSlice";

import "../CSS/Autentificare.scss";
import { closeModal } from "../features/modalSlice";

export const Autentificare = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(
      signInUser({
        email: email,
        password: password,
      })
    );
    handleCloseModal();
  };
  return (
    <div className="autentificare d-flex flex-column justify-content-center align-items-center">
      <h2>Autentificare</h2>
      <form onSubmit={handleLogin}>
        <label className="my-2" htmlFor="email__login">
          E-mail
        </label>
        <input
          className="my-1 p-1"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
        />
        <label className="my-2" htmlFor="password__login">
          Password
        </label>
        <input
          className="my-1 p-1"
          onChange={(e) => setPass(e.target.value)}
          type="password"
          name="password"
        />
        <button className="my-3" type="submit">
          Autentificare
        </button>
      </form>
    </div>
  );
};
