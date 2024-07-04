import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../main";
import "../CSS/Tura.scss";
import { useAppSelector } from "../app/hooks";

const Tura = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [points, setPoints] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [organizer, setOrganizer] = useState(null);
  const user = useAppSelector((state) => state.user.user);
  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const routeDoc = await getDoc(doc(db, "ture", id));
        if (routeDoc.exists()) {
          const routeData = routeDoc.data();
          setRoute(routeData);

          const userDoc = await getDoc(doc(db, "users", routeData.createdBy));
          if (userDoc.exists()) {
            setOrganizer(userDoc.data());
          }

          const allCities = [
            routeData.departureCity,
            ...routeData.intermediateCities,
            routeData.arrivalCity,
          ];

          const pointsPromises = allCities.map((city) => fetchGeocoding(city));
          const newPoints = await Promise.all(pointsPromises);
          const validPoints = newPoints.filter((point) => point !== null);

          if (validPoints.length >= 2) {
            setPoints(validPoints);
            let totalRoute = [];
            for (let i = 0; i < validPoints.length - 1; i++) {
              const result = await fetchRouteSegment(
                validPoints[i],
                validPoints[i + 1]
              );
              if (result) {
                totalRoute = totalRoute.concat(result.routeCoordinates);
              }
            }
            setRouteCoordinates(totalRoute);
          } else {
            console.error("Not enough valid points to calculate route.");
          }
        } else {
          console.error("Route not found.");
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
      }
    };
    fetchRoute();
  }, [id]);

  const fetchGeocoding = async (city) => {
    const apiKey = "5b3ce3597851110001cf6248d4eb3313e121466aaf1357d615d4ba59";
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

  const fetchRouteSegment = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf6248d4eb3313e121466aaf1357d615d4ba59";
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      const routeCoordinates = data.features[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );
      return { routeCoordinates };
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
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

  const capitalizeCity = (city) => {
    if (!city) return "";
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  };

  const handleParticipate = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const routeDocRef = doc(db, "ture", id);

      const routeDoc = await getDoc(routeDocRef);
      if (!routeDoc.exists()) {
        console.error("Route not found");
        return;
      }

      const currentParticipants = routeDoc.data().participants || 0;

      await updateDoc(routeDocRef, {
        participants: currentParticipants + 1,
      });

      setRoute((prevRoute) => ({
        ...prevRoute,
        participants: currentParticipants + 1,
      }));
      setHasParticipated(true);
    } catch (error) {
      console.error("Error updating participants:", error);
    }
  };

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container tura-details my-4 p-4 rounded">
      <div className="d-flex align-items-center justify-content-center">
        <h2 className="mx-2">Traseu: </h2>
        <h2>{capitalizeCity(route.departureCity)}</h2>
        <h2 className="mx-2">-&gt;</h2>
        {route.intermediateCities &&
          route.intermediateCities.map((city, index) => (
            <h2 key={index}>{`${capitalizeCity(city)} -&gt;`}</h2>
          ))}
        <h2 className="mx-2">{capitalizeCity(route.arrivalCity)}</h2>
      </div>

      <div className="map-container">
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
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="blue" />
          )}
        </MapContainer>
      </div>
      <div className="description">
        <h3>Descriere</h3>
        <p>{route.description}</p>
      </div>
      <div className="details">
        <h3>Detalii de participare</h3>
        <p>Distanță aproximativă: {route.km} km</p>
        <p>
          Durata: {route.duration} {route.duration === 1 ? "zi" : "zile"}
        </p>
        <p>Cost estimativ: {route.cost} RON</p>
        <p>Viteza de croazieră: {route.cruisingSpeed} km/h</p>
        <p>Experiență necesară: {route.minExperience}</p>
        <p>Vârstă necesară: {route.minAge} ani</p>
        <p>CMC necesar: {route.minCcm}</p>
      </div>
      <div className="departure">
        <h3>Plecare</h3>
        <p>Data plecării: {route.time.split("T")[0]}</p>
        <p>Ora plecării: {route.time.split("T")[1]}</p>
        <p>Plecare din: {capitalizeCity(route.departureCity)}</p>
      </div>
      <div className="organizer">
        <h3>Organizator</h3>
        <p>{organizer?.name}</p>
      </div>
      {user && !hasParticipated && (
        <div className="participate">
          <button className="btn btn-primary" onClick={handleParticipate}>
            Participate
          </button>
          <p>Participants: {route.participants}</p>
        </div>
      )}
      {user && hasParticipated && (
        <div className="participate">
          <p>You have participated. Participants: {route.participants}</p>
        </div>
      )}
    </div>
  );
};

export default Tura;
