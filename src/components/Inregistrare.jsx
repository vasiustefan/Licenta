import { useState } from "react";

import "../CSS/Inregistrare.scss";
import { registerUser } from "../features/userSlice";
import { useAppDispatch } from "../app/hooks";
import { closeModal } from "../features/modalSlice";

export const Inregistrare = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email: email,
        password: password,
      })
    );
    handleCloseModal();
  };

  return (
    <div className="inregistrare d-flex flex-column justify-content-center align-items-center">
      <h2>Inregistrare</h2>
      <form onSubmit={handleRegister}>
        <label className="my-2" htmlFor="email__register">
          E-mail
        </label>
        <input
          className="my-1 p-1"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
        />
        <label className="my-2" htmlFor="password__register">
          Password
        </label>
        <input
          className="my-1 p-1"
          onChange={(e) => setPass(e.target.value)}
          type="password"
          name="password"
        />
        <button className="my-3" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};
