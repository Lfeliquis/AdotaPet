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

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const requests = [];

        if (isAdmin) {
          requests.push(api.get("/pets/my-pets"));
        } else {
          requests.push(Promise.resolve({ data: [] }));
        }

        requests.push(api.get("/pets/my-adoptions"));

        const [petsRes, adoptionsRes] = await Promise.all(requests);

        setMyPets(petsRes.data || []);
        setMyAdoptions(adoptionsRes.data || []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [isAdmin]);

  const availablePets = myPets.filter(
    (pet) => pet.status === "available",
  ).length;

  const adoptedPets = myPets.filter((pet) => pet.status === "adopted").length;

  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="dashboard-hero">
          <h1>Bem-vindo, {user?.name}</h1>

          <p>Gerencie informações e acompanhe atividades do sistema.</p>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {isAdmin ? (
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
              </div>
            ) : (
              <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-label">
                    Minhas solicitações
                  </span>

                  <strong>{myAdoptions.length}</strong>
                </div>
              </div>
            )}

            <div className="dashboard-grid">
              {isAdmin ? (
                <>
                  <div className="dashboard-box">
                    <h3>Cadastrar Pet</h3>

                    <p>Adicione novos pets para adoção.</p>

                    <button onClick={() => navigate("/cadastrar-pet")}>
                      Cadastrar
                    </button>
                  </div>

                  <div className="dashboard-box">
                    <h3>Meus Pets</h3>

                    <p>Gerencie os pets cadastrados.</p>

                    <button onClick={() => navigate("/my-pets")}>
                      Gerenciar
                    </button>
                  </div>

                  <div className="dashboard-box">
                    <h3>Solicitações</h3>

                    <p>Aprove ou rejeite pedidos de adoção.</p>

                    <button onClick={() => navigate("/adoption-requests")}>
                      Ver solicitações
                    </button>
                  </div>

                  <div className="dashboard-box">
                    <h3>Marketplace</h3>

                    <p>Visualize todos os pets publicados.</p>

                    <button onClick={() => navigate("/")}>Ver pets</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="dashboard-box">
                    <h3>Explorar Pets</h3>

                    <p>Veja os pets disponíveis para adoção.</p>

                    <button onClick={() => navigate("/")}>Ver pets</button>
                  </div>

                  <div className="dashboard-box">
                    <h3>Minhas Solicitações</h3>

                    <p>Acompanhe suas solicitações de adoção.</p>

                    <button onClick={() => navigate("/my-adoptions")}>
                      Ver solicitações
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </PageContainer>
    </>
  );
}
