import { useEffect, useState } from "react";
import { FaMotorcycle, FaPhone, FaEnvelope } from "react-icons/fa";
import { Routes } from "../router";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../main";
import "../CSS/ContulMeu.scss";
import { useAppSelector } from "../app/hooks";
import { CardRuta } from "../components/CardRuta"; // Import CardRuta component

const ContulMeu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [userTours, setUserTours] = useState([]);

  useEffect(() => {
    const fetchUserTours = async () => {
      if (user && user.uid) {
        const q = query(
          collection(db, "ture"),
          where("createdBy", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const tours = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserTours(tours);
      }
    };

    if (user && user.uid) {
      fetchUserTours();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const getFormattedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  return (
    <div className="contul_meu_container">
      <div className="user_info">
        <div className="profile_picture">
          <FaMotorcycle size="100%" color="#fd390e" />
        </div>
        <span>Membru din: {getFormattedDate(user.memberSince)}</span>
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
        <h3>Ture create: </h3>
        {userTours.length > 0 ? (
          userTours.map((tour, index) => <CardRuta key={index} route={tour} />)
        ) : (
          <p>Nu s-a găsit nici o participare.</p>
        )}
      </div>

      <div className="contact_info">
        <h4>Informații</h4>
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
