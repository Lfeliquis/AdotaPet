import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import "./Pets.css";

function Pets() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPets() {
      try {
        const response = await api.get("/pets");
        setPets(response.data);
      } catch (err) {
        setError("Erro ao carregar os pets");
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name?.toLowerCase().includes(search.toLowerCase()) ||
        pet.description?.toLowerCase().includes(search.toLowerCase());

      const matchesSize = sizeFilter ? pet.size === sizeFilter : true;

      return matchesSearch && matchesSize;
    });
  }, [pets, search, sizeFilter]);

  return (
    <div className="pets-page">
      <Header />

      <div className="pets-hero">
        <div>
          <h1>Encontre um novo melhor amigo 🐾</h1>
          <p>Adote com amor. Veja os pets disponíveis perto de você.</p>
        </div>
      </div>

      <div className="pets-content">
        <SearchBar
          search={search}
          setSearch={setSearch}
          sizeFilter={sizeFilter}
          setSizeFilter={setSizeFilter}
        />

        {loading && <p className="pets-message">Carregando pets...</p>}
        {error && <p className="pets-message error">{error}</p>}

        {!loading && !error && filteredPets.length === 0 && (
          <p className="pets-message">Nenhum pet encontrado.</p>
        )}

        <div className="pets-grid">
          {filteredPets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pets;
