import { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaTrash } from "react-icons/fa";
import bikerImg from "../images/biker.avif";
import { Routes } from "../router";
import { Link } from "react-router-dom";
import { fetchUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../main";
import "../CSS/ContulMeu.scss";
import { useAppSelector } from "../app/hooks";
import { CardRuta } from "../components/CardRuta";

const ContulMeu = () => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [userTours, setUserTours] = useState([]);

  useEffect(() => {
    if (user && user.uid && !user.name) {
      dispatch(fetchUser(user.uid));
    }
  }, [dispatch, user]);

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "ture", id));
      setUserTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

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
          <img src={bikerImg} alt="Avatar" className="avatar" />
          <span>Nume: {user.name}</span>
          <span>Membru din: {getFormattedDate(user.memberSince)}</span>
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
        <h3>Ture create: </h3>
        {userTours.length > 0 ? (
          userTours.map((tour, index) => (
            <div
              key={index}
              className="tour-item d-flex my-2 justify-content-between"
            >
              <CardRuta route={tour} />
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(tour.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))
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
