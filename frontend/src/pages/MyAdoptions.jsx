import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

export default function MyAdoptions() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyAdoptions() {
      try {
        const res = await api.get("/my-adoptions");
        setPets(res.data);
      } catch (err) {
        console.error("Erro ao buscar minhas adoções:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyAdoptions();
  }, []);

  return (
    <>
      <Navbar />

      <PageContainer title="Minhas Adoções" emoji="❤️">
      {loading ? (
  <ListSkeleton count={3} />
) : pets.length === 0 ? (
  <div className="empty-state-box">
    <p>Você ainda não adotou nenhum pet.</p>
    <button className="btn btn-primary" onClick={() => navigate("/")}>
      Ver pets disponíveis
    </button>
  </div>
) : (
          <div className="list-page">
            {pets.map((pet) => (
              <div className="list-row" key={pet._id}>
                <div className="list-left">
                  <img
                    className="list-thumb"
                    src={pet.image || "/images/pet-placeholder.jpg"}
                    alt={pet.name}
                  />

                  <div className="list-content">
                    <h3>{pet.name}</h3>
                    <p>
                      {pet.species || "Pet"}
                      {pet.breed ? ` • ${pet.breed}` : ""}
                    </p>
                    <p>{pet.age ? `${pet.age} anos` : "Idade não informada"}</p>
                    <p>
                      <strong>Dono anterior:</strong>{" "}
                      {pet.owner?.name || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="list-right">
                  <span className="list-status adopted">Adotado por você</span>

                  <div className="list-actions">
                    <button
                      className="btn btn-neutral"
                      onClick={() => navigate(`/pets/${pet._id}`)}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
