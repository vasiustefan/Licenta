import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { signInUser } from "../features/userSlice";
export const Autentificare = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const dispatch = useAppDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(
      signInUser({
        email: email,
        password: password,
      })
    );
  };
  return (
    <>
      <div>
        {email}
        {password}
      </div>
      <h2>Autentificare</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label className="label-form" htmlFor="email__login">
          E-mail
        </label>
        <input
          className="input-form"
          id="email__login"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
        />
        <label className="label-form" htmlFor="password__login">
          Password
        </label>
        <input
          className="input-form"
          id="password__login"
          onChange={(e) => setPass(e.target.value)}
          type="password"
          name="password"
        />
        <button className="log-sign-btn" type="submit">
          Autentificare
        </button>
      </form>
    </>
  );
};
