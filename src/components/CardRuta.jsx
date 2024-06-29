/* eslint-disable react/prop-types */

import biker from "../images/biker.avif";
import { CiRoute, CiCreditCard1, CiCalendar } from "react-icons/ci";
import { IoPeople } from "react-icons/io5";
import { FaRegClock, FaMotorcycle } from "react-icons/fa";
import { TbAward } from "react-icons/tb";

import "../CSS/CardRuta.scss";

export const CardRuta = ({ isSpecial = false, cardData }) => {
  return (
    <div className="row card-ruta">
      <div
        className={`${
          isSpecial ? "col-3 col-lg-12" : "col-3"
        } cover-container d-flex flex-column align-items-center justify-content-center`}
      >
        <div className="status">status</div>
        <div className="card-image">
          <img src={biker} alt="biker" />
          <div>name</div>
        </div>
      </div>

      <div className={`${isSpecial ? "col-9 col-lg-12" : "col-9"}`}>
        <div className="row">
          <div className="col-12 d-flex justify-content-between">
            <p>Data</p>
            <p>Participare libera</p>
          </div>
          <div className="col-12">Traseu </div>
          <div className="col-12">
            <div>
              <CiRoute className="me-2" />
              Km:
            </div>
            <div>
              <IoPeople className="me-2" />
              Participanti:
            </div>
            <div>
              <CiCreditCard1 className="me-2" />
              Cost estimativ:
            </div>
          </div>
          <hr />
          <div className="col-12 d-flex flex-wrap justify-content-evenly">
            <div className="me-1 mt-3 text-center">
              <p>
                <FaRegClock className="card_icons_bottom" />
              </p>
              <p>Durata</p>
            </div>
            <div className="me-1 mt-3 text-center">
              <p>
                <TbAward className="card_icons_bottom" />
              </p>
              <p>Dificultate</p>
            </div>
            <div className="me-1 mt-3 text-center">
              <p>
                <CiCalendar className="card_icons_bottom" />
              </p>
              <p>18+</p>
            </div>
            <div className="me-1 mt-3 text-center">
              <p>
                <FaMotorcycle className="card_icons_bottom" />
              </p>
              <p>500+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
