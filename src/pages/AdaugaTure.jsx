//5b3ce3597851110001cf6248d4eb3313e121466aaf1357d615d4ba59
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
import "../CSS/AdaugaTure.scss";
import { createNewTura } from "../features/tureSlice";
import { useAppDispatch } from "../app/hooks";

const AdaugaTure = () => {
  const dispatch = useAppDispatch();
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [intermediateCities, setIntermediateCities] = useState([""]);
  const [points, setPoints] = useState([]);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const [dataRoute, setDataRoute] = useState({
    part_type: "",
    time: "",
    start_place: "",
  });

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setDataRoute((prevDataRoute) => ({
      ...prevDataRoute,
      [name]: value,
    }));
  };

  const handleCityChange = (e, index) => {
    const newCities = [...intermediateCities];
    newCities[index] = e.target.value;
    setIntermediateCities(newCities);
  };

  const handleAddCity = () => {
    setIntermediateCities([...intermediateCities, ""]);
  };

  const handleRemoveCity = (index) => {
    const newCities = intermediateCities.filter((_, i) => i !== index);
    setIntermediateCities(newCities);
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
      console.error("Error fetching geocoding:", error);
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
      console.error("Error fetching route:", error);
      return null;
    }
  };

  const updateRoute = async () => {
    const allCities = [departureCity, ...intermediateCities, arrivalCity];
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
        }
      }
      setRoute(totalRoute);
      setDistance(totalDistance / 1000);
      setCost((totalDistance / 1000) * 0.75);
    } else {
      console.error("Not enough valid points to calculate route.");
    }
  };

  useEffect(() => {
    if (departureCity && arrivalCity) {
      updateRoute();
    }
  }, [departureCity, arrivalCity, intermediateCities]);

  const handleAddTura = (e) => {
    e.preventDefault();
    dispatch(createNewTura(dataRoute));
    setDataRoute({
      part_type: "",
      time: "",
      start_place: "",
    });
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

  console.log({ dataRoute });
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
              <option>Participare liberă</option>
              <option>Participare cu înscriere</option>
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
                required="req"
              />
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="approximateCost">Cost aproximativ (RON)</label>
            <div className="input-group">
              {distance && cost && (
                <label className="form-control">{cost.toFixed(2)}</label>
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
              required="req"
            />
          </div>
          <button>Apasa</button>
        </form>
      </div>

      <div className="cerinte_participare_form mt-5">
        <h3 className="mb-4">Cerințe de participare</h3>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="minAge">Vârsta minimă</label>
            <input
              type="number"
              className="form-control"
              id="minAge"
              placeholder="Vârsta minimă"
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
              required="req"
            />
          </div>
          <div className="form-group mb-3">
            <div>
              <label htmlFor="minExperience">Experiență minimă</label>
              <select
                className="form-control"
                id="minExperience"
                required="req"
              >
                <option>-- Alege o opțiune --</option>
                <option>Începător</option>
                <option>Intermediar</option>
                <option>Avansat</option>
              </select>
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="preferredEquipment">Echipament preferabil</label>
            <textarea
              className="form-control"
              id="preferredEquipment"
              placeholder="Echipament preferabil"
            ></textarea>
          </div>
        </form>
      </div>

      <div className="traseu_form mt-5">
        <h2>Traseul</h2>
        <form onSubmit={handleAddTura}>
          <div className="form-group mb-3">
            <label htmlFor="departureCity">Orașul de plecare</label>
            <input
              type="text"
              className="form-control"
              id="departureCity"
              placeholder="Orașul de plecare"
              required="req"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
            />
          </div>
          {intermediateCities.map((city, index) => (
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
              value={arrivalCity}
              onChange={(e) => setArrivalCity(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="mb-3 px-2 form_btn_adauga_ture"
            onClick={handleAddCity}
          >
            Adaugă locație intermediară
          </button>
        </form>
        <MapContainer
          center={[46.77, 23.59]}
          zoom={6}
          scrollWheelZoom={false}
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
        {distance && cost && (
          <div className="route_info text-center">
            <p>Distanța: {distance.toFixed(2)} km</p>
            <p>Cost estimativ: {cost.toFixed(2)} RON</p>
          </div>
        )}
        <button type="submit" className="btn_submit">
          Adaugă tura
        </button>
      </div>
    </div>
  );
};

export default AdaugaTure;
