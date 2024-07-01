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
import "../CSS/Tura.scss"; // Ensure this file is styled appropriately

const Tura = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [points, setPoints] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    // Fetch route details from API
    const fetchRoute = async () => {
      try {
        const response = await axios.get(`/api/routes/${id}`);
        setRoute(response.data);

        const allCities = [
          response.data.from,
          ...response.data.waypoints,
          response.data.to,
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

  if (!route) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container tura-details my-4 p-4 rounded">
      <h2>{`Tura #${route.id} - ${route.from} → ${route.to}`}</h2>
      <div className="map-container">
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
        <p>Distanță aproximativă: {route.distance} km</p>
        <p>Durata: {route.duration}</p>
        <p>Cost estimativ: {route.cost} RON</p>
        <p>Viteza de croazieră: {route.speed}</p>
        <p>Experiență necesară: {route.experience}</p>
        <p>Vârstă necesară: {route.age}</p>
        <p>CMC necesar: {route.cmc}</p>
      </div>
      <div className="departure">
        <h3>Plecare</h3>
        <p>Data plecării: {route.departureDate}</p>
        <p>Ora plecării: {route.departureTime}</p>
        <p>Plecare din: {route.departureCity}</p>
      </div>
      <div className="organizer">
        <h3>Organizator</h3>
        <p>{route.organizer}</p>
      </div>
    </div>
  );
};

export default Tura;
