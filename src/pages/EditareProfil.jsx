import { useState } from "react";
import "../CSS/EditareProfil.scss";

const EditareProfil = () => {
  const [profile, setProfile] = useState({
    username: "vasilestefan",
    email: "gr8_stefan@yahoo.com",
    name: "BaBanu",
    phone: "0746383404",
    privatePhone: true,
    city: "Sibiu",
    birthYear: 2000,
    moto: "Honda Shadow",
    cmc: 600,
    experience: "Începător",
    extraEquipment: "Nu detin echipament extra",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Profile updated:", profile);
  };

  return (
    <div className="container editare_profil_form my-4 p-4 rounded">
      <h2 className="text-center mb-4">Editare date cont</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled
          />
        </div>
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
        <div className="form-group d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Salvează modificările
          </button>
          <button type="button" className="btn btn-secondary">
            Închide contul
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditareProfil;
