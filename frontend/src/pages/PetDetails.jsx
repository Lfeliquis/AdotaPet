import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PetDetailsSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adopting, setAdopting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err) {
        console.error("Erro ao carregar pet:", err);
        toast.error("Não foi possível carregar os detalhes do pet");
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]);

  async function handleAdopt() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Deseja adotar este pet?")) return;

    try {
      setAdopting(true);
      await api.post(`/pets/${pet._id}/adopt`);
      toast.success("Pet adotado com sucesso ❤️");

      const res = await api.get(`/pets/${id}`);
      setPet(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao adotar pet");
    } finally {
      setAdopting(false);
    }
  }

if (loading) {
  return (
    <>
      <Navbar />
      <PetDetailsSkeleton />
    </>
  );
}

  if (!pet) {
    return (
      <>
        <Navbar />
        <div className="page-shell">
          <div className="page-container">
            <p>Pet não encontrado.</p>
          </div>
        </div>
      </>
    );
  }

  const isOwner = user && pet.owner && pet.owner._id === user.id;
  const adoptedByCurrentUser =
    user && pet.adoptedBy && pet.adoptedBy._id === user.id;
  const adoptedByAnotherUser =
    pet.status === "adopted" && !adoptedByCurrentUser;

  return (
    <>
      <Navbar />

      <div className="pet-details-page">
        <div className="pet-details-container">
          <div className="pet-details-card">
            <div className="pet-details-image">
              <img
                src={pet.image || "/images/pet-placeholder.jpg"}
                alt={pet.name}
              />
            </div>

            <div className="pet-details-info">
              <div className="pet-details-header">
                <h1>{pet.name}</h1>

                <span
                  className={`pet-status-badge ${
                    pet.status === "adopted" ? "adopted" : "available"
                  }`}
                >
                  {pet.status === "adopted" ? "Adotado" : "Disponível"}
                </span>
              </div>

              <p className="pet-details-meta">
                <strong>Espécie:</strong> {pet.species || "Não informado"}
              </p>

              <p className="pet-details-meta">
                <strong>Raça:</strong> {pet.breed || "Não informado"}
              </p>

              <p className="pet-details-meta">
                <strong>Idade:</strong>{" "}
                {pet.age ? `${pet.age} anos` : "Não informado"}
              </p>

              <p className="pet-details-meta">
                <strong>Responsável:</strong>{" "}
                {pet.owner?.name || "Não informado"}
              </p>

              {pet.adoptedAt && (
                <p className="pet-details-meta">
                  <strong>Data da adoção:</strong>{" "}
                  {new Date(pet.adoptedAt).toLocaleDateString("pt-BR")}
                </p>
              )}

              <div className="pet-details-description">
                <h3>Descrição</h3>
                <p>{pet.description || "Sem descrição."}</p>
              </div>

              {isOwner && (
                <div className="content-card" style={{ padding: "16px" }}>
                  <p style={{ margin: 0 }}>Este pet foi cadastrado por você.</p>
                </div>
              )}

              {adoptedByCurrentUser && (
                <div className="content-card" style={{ padding: "16px" }}>
                  <p style={{ margin: 0 }}>Você adotou este pet ❤️</p>
                </div>
              )}

              {adoptedByAnotherUser && (
                <div className="content-card" style={{ padding: "16px" }}>
                  <p style={{ margin: 0 }}>Este pet já foi adotado.</p>
                </div>
              )}

              {isOwner ? (
                <button
                  className="adopt-button"
                  onClick={() => navigate(`/editar-pet/${pet._id}`)}
                >
                  Editar meu pet
                </button>
              ) : pet.status === "available" ? (
                <button
                  className="adopt-button"
                  disabled={adopting}
                  onClick={handleAdopt}
                >
                  {adopting ? "Adotando..." : "Adotar pet"}
                </button>
              ) : (
                <button className="adopt-button disabled" disabled>
                  {adoptedByCurrentUser
                    ? "Você já adotou este pet"
                    : "Pet já adotado"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}