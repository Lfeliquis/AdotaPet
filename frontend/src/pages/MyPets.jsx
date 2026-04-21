import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";
import toast from "react-hot-toast";

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchMyPets() {
    try {
      const res = await api.get("/my-pets");
      setPets(res.data);
    } catch (err) {
      console.error("Erro ao buscar meus pets:", err);
      toast.error("Erro ao buscar seus pets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyPets();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Deseja realmente excluir este pet?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/pets/${id}`);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== id));
      toast.success("Pet removido com sucesso 🗑️");
    } catch (err) {
      console.error("Erro ao excluir pet:", err);
      toast.error(err.response?.data?.message || "Erro ao excluir pet");
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer
        title="Meus Pets"
        emoji="🐾"
        action={
          <button
            className="btn-link"
            onClick={() => navigate("/cadastrar-pet")}
          >
            + Cadastrar novo pet
          </button>
        }
      >
{loading ? (
  <ListSkeleton count={3} />
) : pets.length === 0 ? (
  <div className="empty-state-box">
    <p>Você ainda não cadastrou nenhum pet.</p>
    <button
      className="btn btn-primary"
      onClick={() => navigate("/cadastrar-pet")}
    >
      Cadastrar agora
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
                  </div>
                </div>

                <div className="list-right">
                  <span
                    className={`list-status ${
                      pet.status === "adopted" ? "adopted" : "available"
                    }`}
                  >
                    {pet.status === "adopted" ? "Adotado" : "Disponível"}
                  </span>

                  <div className="list-actions">
                    <button
                      className="btn btn-neutral"
                      onClick={() => navigate(`/pets/${pet._id}`)}
                    >
                      Ver
                    </button>

                    <button
                      className="btn btn-neutral"
                      onClick={() => navigate(`/editar-pet/${pet._id}`)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(pet._id)}
                    >
                      Excluir
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