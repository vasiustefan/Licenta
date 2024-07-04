import { useEffect, useState } from "react";
import { db } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import bikerImg from "../images/biker.avif";
import "../CSS/EditareProfil.scss";
import { fetchUser } from "../features/userSlice";

const EditareProfil = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Get the current user from the Redux store

  const [profile, setProfile] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
    birthYear: "",
    moto: "",
    cmc: "",
    experience: "",
    extraEquipment: "",
    memberSince: "",
  });

  useEffect(() => {
    if (user && user.uid && !user.name) {
      dispatch(fetchUser(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && user.uid) {
      setProfile({
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
        birthYear: user.birthYear || "",
        moto: user.moto || "",
        cmc: user.cmc || "",
        experience: user.experience || "",
        extraEquipment: user.extraEquipment || "",
        memberSince: user.memberSince || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      console.error("User is not logged in or user ID is undefined");
      return;
    }
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        birthYear: profile.birthYear,
        moto: profile.moto,
        cmc: profile.cmc,
        experience: profile.experience,
        extraEquipment: profile.extraEquipment,
      });

      console.log("Profile updated:", profile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Check for invalid date
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  profile.memberSince = getFormattedDate(profile.memberSince);
  return (
    <div className="container editare_profil_form my-4 p-4 rounded">
      <h2 className="text-center mb-4">Editare date cont</h2>
      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Adresa de email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="name">Nume / Poreclă</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Nr. de telefon</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="city">Oraș</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="birthYear">Anul nașterii</label>
              <input
                type="number"
                className="form-control"
                id="birthYear"
                name="birthYear"
                value={profile.birthYear}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="moto">Motocicletă ( marcă / model )</label>
              <input
                type="text"
                className="form-control"
                id="moto"
                name="moto"
                value={profile.moto}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="cmc">Capacitate motor ( cmc )</label>
              <input
                type="number"
                className="form-control"
                id="cmc"
                name="cmc"
                value={profile.cmc}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="experience">Experiență</label>
              <select
                className="form-control"
                id="experience"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
              >
                <option value="Începător">Începător</option>
                <option value="Intermediar">Intermediar</option>
                <option value="Avansat">Avansat</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="extraEquipment">Echipament extra</label>
              <textarea
                className="form-control"
                id="extraEquipment"
                name="extraEquipment"
                value={profile.extraEquipment}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="memberSince">Membru din</label>
              <input
                type="text"
                className="form-control"
                id="memberSince"
                name="memberSince"
                value={profile.memberSince}
                disabled
              />
            </div>
            <div className="form-group d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Salvează modificările
              </button>
              <button type="button" className="btn btn-secondary">
                Sterge contul
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <div className="profile_picture_container text-center">
            <div className="d-flex flex-column align-items-center">
              <img src={bikerImg} alt="Avatar" className="avatar" />
              <label htmlFor="name">{profile.name}</label>
            </div>
            <input type="file" id="avatarInput" style={{ display: "none" }} />
            <button className="btn btn-warning my-3">
              Schimbă-ți avatarul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditareProfil;
