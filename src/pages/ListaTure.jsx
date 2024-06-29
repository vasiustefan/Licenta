import { Link } from "react-router-dom";

import { Routes } from "../router";

const ListaTure = () => {
  return (
    <>
      <div>ListaTure</div>
      <Link to={Routes.AdaugaTure}>Adauga Tura</Link>
    </>
  );
};
export default ListaTure;
