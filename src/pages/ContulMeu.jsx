import { FaMotorcycle, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { Routes } from "../router";
import { Link } from "react-router-dom";
import "../CSS/ContulMeu.scss";

const ContulMeu = () => {
  const user = {
    username: "BaBanu",
    memberSince: "12-11-2023",
    birthYear: 2000,
    city: "Sibiu",
    moto: "Honda Shadow",
    cmc: 600,
    extraEquipment: "Nu detin echipament extra",
    participations: 0,
    activeStatus: "Acum 0s",
    phone: "Privat",
    email: "Privat",
  };

  return (
    <div className="contul_meu_container">
      <div className="user_info">
        <div className="profile_picture">
          <FaMotorcycle size="100%" color="#fd390e" />
        </div>
        <div className="user_details">
          <h2>{user.username}</h2>
          <p>Membru din: {user.memberSince}</p>
        </div>
      </div>

      <div className="user_bio">
        <div className="bio_item">
          <span>Născut în:</span> <span>{user.birthYear}</span>
        </div>
        <div className="bio_item">
          <span>Din:</span> <span>{user.city}</span>
        </div>
        <div className="bio_item">
          <span>Moto:</span> <span>{user.moto}</span>
        </div>
        <div className="bio_item">
          <span>CMC:</span> <span>{user.cmc}</span>
        </div>
        <div className="bio_item">
          <span>Echipament extra:</span> <span>{user.extraEquipment}</span>
        </div>
      </div>

      <div className="participations">
        <h3>Participări la ture: {user.participations}</h3>
        <p>Nu s-a găsit nici o participare.</p>
      </div>

      <div className="contact_info">
        <h4>Informații</h4>
        <p>
          <FaClock /> Activ: {user.activeStatus}
        </p>
        <p>
          <FaPhone /> Telefon: {user.phone}
        </p>
        <p>
          <FaEnvelope /> Email: {user.email}
        </p>
      </div>
      <button className="btn_editare">
        <Link to={Routes.EditareProfil}>Editare profil</Link>
      </button>
    </div>
  );
};

export default ContulMeu;
