import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetGridSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecies, setFilterSpecies] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await api.get("/pets");
        setPets(res.data);
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, []);

  const speciesOptions = useMemo(() => {
    const uniqueSpecies = [...new Set(
      pets
        .map((pet) => pet.species)
        .filter(Boolean)
        .map((species) => species.trim())
    )];

    return uniqueSpecies;
  }, [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name?.toLowerCase().includes(search.toLowerCase()) ||
        pet.species?.toLowerCase().includes(search.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ? true : pet.status === filterStatus;

      const matchesSpecies =
        filterSpecies === "all" ? true : pet.species === filterSpecies;

      return matchesSearch && matchesStatus && matchesSpecies;
    });
  }, [pets, search, filterStatus, filterSpecies]);

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>Encontre um novo melhor amigo</h1>
          <p>
            Adote com responsabilidade e dê um novo lar para pets que precisam
            de carinho.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nome, espécie ou raça"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="available">Disponíveis</option>
              <option value="adopted">Adotados</option>
            </select>

            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
            >
              <option value="all">Todas as espécies</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="section-header">
          <h2>Pets cadastrados</h2>
          <span>{filteredPets.length} encontrados</span>
        </div>

        {loading ? (
          <PetGridSkeleton count={6}/>
        ) : filteredPets.length === 0 ? (
          <div className="empty-state-box">
            <p>Nenhum pet encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="pet-grid">
            {filteredPets.map((pet) => (
              <div
                className="pet-card"
                key={pet._id}
                onClick={() => navigate(`/pets/${pet._id}`)}
              >
                <div className="pet-image">
                  <img
                    src={pet.image || "/images/pet-placeholder.jpg"}
                    alt={pet.name}
                  />

                  <span
                    className={`pet-badge ${
                      pet.status === "adopted" ? "adopted" : "available"
                    }`}
                  >
                    {pet.status === "adopted" ? "Adotado" : "Disponível"}
                  </span>
                </div>

                <div className="pet-info">
                  <h3>{pet.name}</h3>

                  <p>
                    {pet.species || "Pet"}
                    {pet.breed ? ` • ${pet.breed}` : ""}
                  </p>

                  <p>
                    {pet.age ? `${pet.age} anos` : "Idade não informada"}
                  </p>

                  <button
                    className="details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pets/${pet._id}`);
                    }}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}