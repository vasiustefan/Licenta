import { useState } from "react";

import "../CSS/Inregistrare.scss";
import { registerUser } from "../features/userSlice";
import { useAppDispatch } from "../app/hooks";

export const Inregistrare = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const dispatch = useAppDispatch();

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email: email,
        password: password,
      })
    );
  };

  console.log(email);

  return (
    <div className="inregistrare">
      <div>
        {email}
        {password}
      </div>
      <h2>Inregistrare</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <label className="label-form" htmlFor="email__register">
          E-mail
        </label>
        <input
          className="input-form"
          id="email__register"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
        />
        <label className="label-form" htmlFor="password__register">
          Password
        </label>
        <input
          className="input-form"
          id="password__register"
          onChange={(e) => setPass(e.target.value)}
          type="password"
          name="password"
        />
        <button id="register__button" className="log-sign-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};
