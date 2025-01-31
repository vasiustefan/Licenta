import { useState, useEffect } from "react";
import { CardRuta } from "../components/CardRuta";
import "../CSS/ListaTure.scss";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAllTure } from "../features/tureSlice";

const ListaTure = () => {
  const dispatch = useAppDispatch();
  const { ture, loading, error } = useAppSelector((state) => state.ture);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const [filters, setFilters] = useState({
    city: "",
    distanceMin: "",
    distanceMax: "",
    cmcMin: "",
    cmcMax: "",
    ageMin: "",
    ageMax: "",
    experience: "any",
    costMin: 0,
    costMax: 7000,
  });

  useEffect(() => {
    dispatch(fetchAllTure());
  }, [dispatch]);

  useEffect(() => {
    setFilteredRoutes(ture);
  }, [ture]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    let filtered = ture;

    if (filters.city) {
      filtered = filtered.filter((route) =>
        route.departureCity.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.distanceMin) {
      filtered = filtered.filter(
        (route) => route.km >= parseFloat(filters.distanceMin)
      );
    }

    if (filters.distanceMax) {
      filtered = filtered.filter(
        (route) => route.km <= parseFloat(filters.distanceMax)
      );
    }

    if (filters.cmcMin) {
      filtered = filtered.filter(
        (route) => parseInt(route.minCcm) >= parseInt(filters.cmcMin)
      );
    }

    if (filters.cmcMax) {
      filtered = filtered.filter(
        (route) => parseInt(route.minCcm) <= parseInt(filters.cmcMax)
      );
    }

    if (filters.ageMin) {
      filtered = filtered.filter(
        (route) => parseInt(route.minAge) >= parseInt(filters.ageMin)
      );
    }

    if (filters.ageMax) {
      filtered = filtered.filter(
        (route) => parseInt(route.minAge) <= parseInt(filters.ageMax)
      );
    }

    if (filters.experience !== "any") {
      filtered = filtered.filter(
        (route) => route.minExperience === filters.experience
      );
    }

    if (filters.costMin) {
      filtered = filtered.filter(
        (route) => route.cost >= parseFloat(filters.costMin)
      );
    }

    if (filters.costMax) {
      filtered = filtered.filter(
        (route) => route.cost <= parseFloat(filters.costMax)
      );
    }

    setFilteredRoutes(filtered);
    setShowFilters(false);
    setFilters({
      city: "",
      distanceMin: "",
      distanceMax: "",
      cmcMin: "",
      cmcMax: "",
      ageMin: "",
      ageMax: "",
      experience: "any",
      costMin: 0,
      costMax: 7000,
    });
  };

  return (
    <div className="lista_ture">
      <button
        className="btn btn-primary filter-toggle"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      <div className={`filters p-4 me-1 ${showFilters ? "show" : ""}`}>
        <h3 className="mb-3">Filtre</h3>
        <div className="filter-group mb-3">
          <label className="mb-2" htmlFor="city">
            Plecare din:
          </label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Orice oraș"
            value={filters.city}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group mb-3">
          <label className="mb-2">Distanță (în km)</label>
          <input
            type="number"
            name="distanceMin"
            placeholder="De la"
            value={filters.distanceMin}
            onChange={handleChange}
          />
          <input
            type="number"
            name="distanceMax"
            placeholder="Până la"
            value={filters.distanceMax}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group mb-3">
          <label className="mb-2">CMC necesar</label>
          <input
            type="number"
            name="cmcMin"
            placeholder="Ex: 600"
            value={filters.cmcMin}
            onChange={handleChange}
          />
          <input
            type="number"
            name="cmcMax"
            placeholder="Ex: 600"
            value={filters.cmcMax}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group mb-3">
          <label className="mb-2">Vârstă necesară</label>
          <input
            type="number"
            name="ageMin"
            placeholder="De la"
            value={filters.ageMin}
            onChange={handleChange}
          />
          <input
            type="number"
            name="ageMax"
            placeholder="Până la"
            value={filters.ageMax}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group mb-3">
          <label className="mb-2" htmlFor="experience">
            Nivel de experiență
          </label>
          <select
            name="experience"
            id="experience"
            value={filters.experience}
            onChange={handleChange}
          >
            <option value="any">-- Alege o opțiune --</option>
            <option value="Începător">Începător</option>
            <option value="Intermediar">Intermediar</option>
            <option value="Avansat">Avansat</option>
          </select>
        </div>
        <div className="filter-group mb-3">
          <label className="mb-2">Cost aproximativ</label>
          <input
            type="number"
            name="costMin"
            placeholder="Min"
            value={filters.costMin}
            onChange={handleChange}
          />
          <input
            type="number"
            name="costMax"
            placeholder="Max"
            value={filters.costMax}
            onChange={handleChange}
          />
          <div className="cost-values">
            <span>{filters.costMin} RON</span>
            <span>{filters.costMax} RON</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleApplyFilters}>
          Aplicati filtrele
        </button>
      </div>

      <div className="route_list p-5">
        <h3 className="mb-3">Ture disponibile</h3>
        <div className="d-flex flex-wrap gap-2">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && filteredRoutes.length === 0 && <p>No tours found</p>}
          {!loading &&
            filteredRoutes.map((route) => (
              <CardRuta key={route.id} route={route} isSpecial={false} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListaTure;
