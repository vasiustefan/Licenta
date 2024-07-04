import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../CSS/AdaugaTure.scss";
import { createNewTura } from "../features/tureSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const AdaugaTure = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [dataRoute, setDataRoute] = useState({
    part_type: "",
    time: "",
    start_place: "",
    description: "",
    duration: "",
    cruisingSpeed: "",
    minAge: "",
    minCcm: "",
    minExperience: "",
    preferredEquipment: "",
    cost: 0,
    km: 0,
    arrivalCity: "",
    departureCity: "",
    intermediateCities: [""],
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setDataRoute((prevDataRoute) => ({
      ...prevDataRoute,
      [name]: value,
    }));
  };

  const handleCityChange = (e, index) => {
    const newCities = [...dataRoute.intermediateCities];
    newCities[index] = e.target.value;
    setDataRoute((prevDataRoute) => ({
      ...prevDataRoute,
      intermediateCities: newCities,
    }));
  };

  const handleAddCity = () => {
    setDataRoute((prevDataRoute) => ({
      ...prevDataRoute,
      intermediateCities: [...prevDataRoute.intermediateCities, ""],
    }));
  };

  const handleRemoveCity = (index) => {
    const newCities = dataRoute.intermediateCities.filter(
      (_, i) => i !== index
    );
    setDataRoute((prevDataRoute) => ({
      ...prevDataRoute,
      intermediateCities: newCities,
    }));
  };

  const fetchGeocoding = async (city) => {
    const apiKey = "5b3ce3597851110001cf6248d4eb3313e121466aaf1357d615d4ba59"; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${city}`;
    try {
      const response = await axios.get(url);
      const coordinates = response.data.features[0]?.geometry.coordinates;
      if (!coordinates) {
        throw new Error(`Could not find coordinates for city: ${city}`);
      }
      return { lng: coordinates[0], lat: coordinates[1] };
    } catch (error) {
      console.error(`Error fetching geocoding for city: ${city}`, error);
      return null;
    }
  };

  const fetchRoute = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf6248d4eb3313e121466aaf1357d615d4ba59"; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const routeCoordinates = data.features[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );
      const distanceInMeters = data.features[0].properties.segments.reduce(
        (sum, segment) => sum + segment.distance,
        0
      );
      return { routeCoordinates, distanceInMeters };
    } catch (error) {
      console.error(
        `Error fetching route from ${start.lng},${start.lat} to ${end.lng},${end.lat}`,
        error
      );
      return null;
    }
  };

  const updateRoute = async () => {
    const allCities = [
      dataRoute.departureCity,
      ...dataRoute.intermediateCities,
      dataRoute.arrivalCity,
    ];
    const pointsPromises = allCities.map((city) => fetchGeocoding(city));
    const newPoints = await Promise.all(pointsPromises);
    const validPoints = newPoints.filter((point) => point !== null);
    if (validPoints.length >= 2) {
      setPoints(validPoints);
      let totalDistance = 0;
      let totalRoute = [];
      for (let i = 0; i < validPoints.length - 1; i++) {
        const result = await fetchRoute(validPoints[i], validPoints[i + 1]);
        if (result) {
          totalRoute = totalRoute.concat(result.routeCoordinates);
          totalDistance += result.distanceInMeters;
        } else {
          console.error("Error fetching route, stopping further calculations.");
          return;
        }
      }
      setRoute(totalRoute);
      const distanceInKm = totalDistance / 1000;
      const calculatedCost = distanceInKm * 0.75;
      setDistance(distanceInKm);
      setDataRoute((prevDataRoute) => ({
        ...prevDataRoute,
        km: distanceInKm,
        cost: calculatedCost,
      }));
    } else {
      console.error("Not enough valid points to calculate route.");
    }
  };

  useEffect(() => {
    if (dataRoute.departureCity && dataRoute.arrivalCity) {
      updateRoute();
    }
  }, [
    dataRoute.departureCity,
    dataRoute.arrivalCity,
    dataRoute.intermediateCities,
  ]);

  const handleAddTura = async (e) => {
    e.preventDefault();
    for (let key in dataRoute) {
      if (dataRoute[key] === "" || dataRoute[key] === null) {
        alert("All fields must be filled before submission");
        return;
      }
    }
    if (!user || !user.uid) {
      alert("You must be logged in to create a tour");
      return;
    }

    try {
      dispatch(
        createNewTura({
          ...dataRoute,
          cost: Math.floor(dataRoute.cost),
          km: Math.floor(dataRoute.km),
          createdBy: user.uid,
          participants: 1,
          status: "Tura deschisa",
        })
      );
      setDataRoute({
        part_type: "",
        time: "",
        start_place: "",
        description: "",
        duration: "",
        cruisingSpeed: "",
        minAge: "",
        minCcm: "",
        minExperience: "",
        preferredEquipment: "",
        cost: 0,
        km: 0,
        intermediateCities: [""],
        arrivalCity: "",
        departureCity: "",
      });
    } catch (error) {
      console.error("Error creating tour:", error);
    }
  };

  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;

  const createCustomIcon = (label) => {
    return L.divIcon({
      html: `<div style="background-color: #fd390e; border: 2px solid black; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;"><strong>${label}</strong></div>`,
      iconSize: [30, 30],
      className: "",
    });
  };

  return (
    <div>
      <div className="adauga_tura_form mt-5">
        <h2 className="text-center mb-4">Adaugă o tură</h2>
        <p className="text-center">
          Completează formularul de mai jos pentru a adăuga o tură.
        </p>

        <h3>Informații generale</h3>
        <form onSubmit={handleAddTura}>
          <div className="form-group mb-3">
            <label htmlFor="tourType">Tipul turei</label>
            <select
              className="form-control"
              name="part_type"
              id="tourType"
              value={dataRoute.part_type}
              onChange={handleChangeForm}
              required="req"
            >
              <option value="">Selectează tipul turei</option>
              <option value="Participare liberă">Participare liberă</option>
              <option value="Participare cu înscriere">
                Participare cu înscriere
              </option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="startDateTime">
              Data și ora de începere a turei
            </label>
            <input
              type="datetime-local"
              className="form-control"
              name="time"
              id="startDateTime"
              value={dataRoute.time}
              onChange={handleChangeForm}
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="meetingPlace">Locul de întâlnire</label>
            <input
              type="text"
              className="form-control"
              id="meetingPlace"
              placeholder="Introdu adresa locului de întâlnire."
              name="start_place"
              value={dataRoute.start_place}
              onChange={handleChangeForm}
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description">Descriere</label>
            <textarea
              className="form-control"
              id="description"
              placeholder="Descrierea evenimentului"
              name="description"
              value={dataRoute.description}
              onChange={handleChangeForm}
              required="req"
            ></textarea>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="duration">Durată aproximativă (zile)</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="duration"
                placeholder="Ex: 2"
                name="duration"
                value={dataRoute.duration}
                onChange={handleChangeForm}
                required="req"
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="approximateCost">Cost aproximativ (RON)</label>
            <div className="input-group">
              {distance && dataRoute.cost && (
                <label className="form-control">
                  {dataRoute.cost.toFixed(0)}
                </label>
              )}
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="km">Kilometraj (km)</label>
            <div className="input-group">
              {distance && dataRoute.cost && (
                <label className="form-control">
                  {dataRoute.km.toFixed(0)}
                </label>
              )}
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="cruisingSpeed">Viteza de croazieră</label>
            <input
              type="text"
              className="form-control"
              id="cruisingSpeed"
              placeholder="Viteza cu care se va circula. Ex: 1: în limite legale. Ex: 2: se va conduce mai sportiv."
              name="cruisingSpeed"
              value={dataRoute.cruisingSpeed}
              onChange={handleChangeForm}
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="minAge">Vârsta minimă</label>
            <input
              type="number"
              className="form-control"
              id="minAge"
              placeholder="Vârsta minimă"
              name="minAge"
              value={dataRoute.minAge}
              onChange={handleChangeForm}
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="minCcm">Centimetri cubi minimi</label>
            <input
              type="number"
              className="form-control"
              id="minCcm"
              placeholder="Centimetri cubi minimi"
              name="minCcm"
              value={dataRoute.minCcm}
              onChange={handleChangeForm}
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="minExperience">Experiență minimă</label>
            <select
              className="form-control"
              id="minExperience"
              name="minExperience"
              value={dataRoute.minExperience}
              onChange={handleChangeForm}
              required="req"
            >
              <option value="">-- Alege o opțiune --</option>
              <option value="Începător">Începător</option>
              <option value="Intermediar">Intermediar</option>
              <option value="Avansat">Avansat</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="preferredEquipment">Echipament preferabil</label>
            <textarea
              className="form-control"
              id="preferredEquipment"
              placeholder="Echipament preferabil"
              name="preferredEquipment"
              value={dataRoute.preferredEquipment}
              onChange={handleChangeForm}
            ></textarea>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="departureCity">Orașul de plecare</label>
            <input
              type="text"
              className="form-control"
              id="departureCity"
              placeholder="Orașul de plecare"
              required="req"
              name="departureCity"
              value={dataRoute.departureCity}
              onChange={handleChangeForm}
            />
          </div>
          {dataRoute.intermediateCities.map((city, index) => (
            <div className="form-group mb-3" key={index}>
              <label htmlFor={`intermediateCity${index}`}>
                Oraș intermediar #{index + 1}
              </label>
              <input
                type="text"
                className="form-control"
                required="req"
                id={`intermediateCity${index}`}
                placeholder={`Oraș intermediar`}
                name="intermediateCity"
                value={city}
                onChange={(e) => handleCityChange(e, index)}
              />
              <button
                type="button"
                className="mt-2 px-2 form_btn_adauga_ture"
                onClick={() => handleRemoveCity(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="form-group mb-3">
            <label htmlFor="arrivalCity">Orașul de sosire</label>
            <input
              type="text"
              className="form-control"
              id="arrivalCity"
              placeholder="Orașul de sosire"
              required="req"
              name="arrivalCity"
              value={dataRoute.arrivalCity}
              onChange={handleChangeForm}
            />
          </div>
          <button
            type="button"
            className="mb-3 px-2 form_btn_adauga_ture"
            onClick={handleAddCity}
          >
            Adaugă locație intermediară
          </button>
          <button type="submit" className="btn_submit">
            Adaugă tura
          </button>
        </form>
      </div>

      <MapContainer
        center={[46.77, 23.59]}
        zoom={6}
        scrollWheelZoom={true}
        className="map mb-4"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.map((point, index) => (
          <Marker
            key={index}
            position={point}
            icon={createCustomIcon(labels[labelIndex++])}
          >
            <Tooltip>{labels[labelIndex - 1]}</Tooltip>
          </Marker>
        ))}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default AdaugaTure;
