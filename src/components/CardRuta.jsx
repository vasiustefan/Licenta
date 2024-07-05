/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { CiRoute, CiCreditCard1, CiCalendar } from "react-icons/ci";
import { IoPeople } from "react-icons/io5";
import { FaRegClock, FaMotorcycle } from "react-icons/fa";
import { TbAward } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../main";
import bikerImg from "../images/biker.avif";

import "../CSS/CardRuta.scss";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const capitalizeCities = (cities) => {
  return cities.map(capitalizeFirstLetter);
};

const getStatus = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  if (start.toDateString() === today.toDateString()) {
    return { text: "Tura Inchisa", color: "red" };
  } else if (start < today) {
    return { text: "Tura Finalizata", color: "green" };
  } else {
    return { text: "Tura Deschisa", color: "#fd390e" };
  }
};

export const CardRuta = ({ isSpecial = false, route = {} }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: "" });
  const handleGoTo = () => {
    navigate(`/tura/${route.id}`);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (route.createdBy) {
        const userDoc = await getDoc(doc(db, "users", route.createdBy));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      }
    };

    const updateRouteStatus = async () => {
      const status = getStatus(route.time);
      if (route.id) {
        const routeDoc = doc(db, "ture", route.id);
        await updateDoc(routeDoc, { status: status.text });
      }
    };

    updateRouteStatus();
    fetchUserDetails();
  }, [route.createdBy, route.time, route.id]);

  const capitalizedDepartureCity = capitalizeFirstLetter(route.departureCity);
  const capitalizedArrivalCity = capitalizeFirstLetter(route.arrivalCity);
  const capitalizedIntermediateCities = route.intermediateCities
    ? capitalizeCities(route.intermediateCities)
    : [];

  const cities = [
    capitalizedDepartureCity,
    ...capitalizedIntermediateCities,
    capitalizedArrivalCity,
  ];

  const status = getStatus(route.time);

  return (
    <div className="row card-ruta" onClick={handleGoTo}>
      <div
        className={`${
          isSpecial ? "col-3 col-lg-12" : "col-3"
        } cover-container d-flex flex-column align-items-center justify-content-center`}
      >
        <div className="status" style={{ color: status.color }}>
          {status.text}
        </div>
        <div className="card-image">
          <img src={bikerImg} alt="Avatar" className="avatar" />
        </div>
        <div className="card-image">
          <div>{userDetails.name}</div>
        </div>
      </div>

      <div className={`${isSpecial ? "col-9 col-lg-12" : "col-9"}`}>
        <div className="row">
          <div className="col-12">
            <p>
              Data și ora: {route.time ? route.time.replace("T", " ") : "N/A"}
            </p>
          </div>
          <div className="col-12">{cities.join(" -> ")}</div>
          <div className="col-12">
            <div>
              <CiRoute className="me-2" />
              Km: {Math.round(route.km)}
            </div>
            <div>
              <IoPeople className="me-2" />
              Participanti: {route.participants}
            </div>
            <div>
              <CiCreditCard1 className="me-2" />
              Cost estimativ: {Math.round(route.cost)} RON
            </div>
          </div>
          <hr />
          <div className="col-12 d-flex flex-wrap justify-content-evenly">
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <FaRegClock className="card_icons_bottom" />
              </p>
              <p>
                {route.duration}
                {route.duration != 1 ? " Zile" : " Zi"}
              </p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <TbAward className="card_icons_bottom" />
              </p>
              <p>{route.minExperience}</p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <CiCalendar className="card_icons_bottom" />
              </p>
              <p>{route.minAge}+</p>
            </div>
            <div className="me-1 mt-3 text-center card_parameters">
              <p>
                <FaMotorcycle className="card_icons_bottom" />
              </p>
              <p>{route.minCcm} CMC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
