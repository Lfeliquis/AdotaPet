import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSkeleton } from "../components/Skeletons";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [myPets, setMyPets] = useState([]);
  const [myAdoptions, setMyAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [petsRes, adoptionsRes] = await Promise.all([
          api.get("/pets/my-pets"),
          api.get("/pets/my-adoptions"),
        ]);

        setMyPets(petsRes.data);
        setMyAdoptions(adoptionsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const availablePets = myPets.filter(
    (pet) => pet.status === "available",
  ).length;
  const adoptedPets = myPets.filter((pet) => pet.status === "adopted").length;

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="dashboard-hero">
          <h1>Bem-vindo, {user?.name} 👋</h1>
          <p>
            Gerencie seus pets cadastrados, acompanhe adoções e navegue pelo
            sistema de forma rápida.
          </p>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">Meus pets</span>
                <strong>{myPets.length}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">Pets disponíveis</span>
                <strong>{availablePets}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">Pets adotados</span>
                <strong>{adoptedPets}</strong>
              </div>

              <div className="dashboard-stat-card">
                <span className="dashboard-stat-label">Minhas adoções</span>
                <strong>{myAdoptions.length}</strong>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-box">
                <h3>🐶 Cadastrar pet</h3>
                <p>Adicione um novo animal para adoção no sistema.</p>
                <button onClick={() => navigate("/cadastrar-pet")}>
                  Ir para cadastro
                </button>
              </div>

              <div className="dashboard-box">
                <h3>📋 Meus Pets</h3>
                <p>Veja, edite e remova os pets que você cadastrou.</p>
                <button onClick={() => navigate("/my-pets")}>
                  Ver meus pets
                </button>
              </div>

              <div className="dashboard-box">
                <h3>❤️ Minhas Adoções</h3>
                <p>Acompanhe os pets que você adotou.</p>
                <button onClick={() => navigate("/my-adoptions")}>
                  Ver adoções
                </button>
              </div>

              <div className="dashboard-box">
                <h3>🔎 Explorar Pets</h3>
                <p>Veja todos os pets disponíveis no marketplace.</p>
                <button onClick={() => navigate("/")}>Ir para home</button>
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </>
  );
}
