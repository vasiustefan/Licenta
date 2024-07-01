/* eslint-disable react/prop-types */
import { CiRoute, CiCreditCard1, CiCalendar } from "react-icons/ci";
import { IoPeople } from "react-icons/io5";
import { FaRegClock, FaMotorcycle } from "react-icons/fa";
import { TbAward } from "react-icons/tb";
import { Routes } from "../router";
import { useNavigate } from "react-router-dom";

import "../CSS/CardRuta.scss";

export const CardRuta = ({ isSpecial = false, route = {} }) => {
  const navigate = useNavigate();

  const handleGoTo = () => {
    navigate(Routes.Tura);
  };
  return (
    <div className="row card-ruta" onClick={handleGoTo}>
      <div
        className={`${
          isSpecial ? "col-3 col-lg-12" : "col-3"
        } cover-container d-flex flex-column align-items-center justify-content-center`}
      >
        <div className="status">{route.status}</div>
        <div className="card-image">
          <img src={route.userAvatar} alt={route.user} />
          <div>{route.user}</div>
        </div>
      </div>

      <div className={`${isSpecial ? "col-9 col-lg-12" : "col-9"}`}>
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            <p>Data</p>
          </div>
          <div className="col-12">
            {route.from} &rarr; {route.to}
          </div>
          <div className="col-12">
            <div>
              <CiRoute className="me-2" />
              Km: {route.distance}
            </div>
            <div>
              <IoPeople className="me-2" />
              Participanti: {route.participants}
            </div>
            <div>
              <CiCreditCard1 className="me-2" />
              Cost estimativ: {route.cost}
            </div>
          </div>
          <hr />
          <div className="col-12 d-flex flex-wrap justify-content-evenly">
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <FaRegClock className="card_icons_bottom" />
              </p>
              <p>{route.duration}</p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <TbAward className="card_icons_bottom" />
              </p>
              <p>{route.difficulty}</p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <CiCalendar className="card_icons_bottom" />
              </p>
              <p>{route.age}</p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <FaMotorcycle className="card_icons_bottom" />
              </p>
              <p>{route.cmc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
