import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListSkeleton } from "../components/Skeletons";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";

export default function MyAdoptions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await api.get("/adoptions/my-requests");
        setRequests(res.data);
      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  function getStatusLabel(status) {
    switch (status) {
      case "approved":
        return "Aprovada";

      case "rejected":
        return "Rejeitada";

      default:
        return "Pendente";
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "approved":
        return "adopted";

      case "rejected":
        return "inactive";

      default:
        return "available";
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer title="Minhas Solicitações de Adoção">
        {loading ? (
          <ListSkeleton count={3} />
        ) : requests.length === 0 ? (
          <div className="empty-state-box">
            <p>Você ainda não realizou nenhuma solicitação de adoção.</p>

            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Ver pets disponíveis
            </button>
          </div>
        ) : (
          <div className="list-page">
            {requests.map((request) => (
              <div className="list-row" key={request._id}>
                <div className="list-left">
                  <img
                    className="list-thumb"
                    src={request.pet?.image || "/images/pet-placeholder.jpg"}
                    alt={request.pet?.name}
                  />

                  <div className="list-content">
                    <h3>{request.pet?.name}</h3>

                    <p>
                      {request.pet?.species || "Pet"}
                      {request.pet?.breed ? ` • ${request.pet.breed}` : ""}
                    </p>

                    <p>
                      <strong>Responsável:</strong>{" "}
                      {request.owner?.name || "Não informado"}
                    </p>

                    <p>
                      <strong>Mensagem enviada:</strong>{" "}
                      {request.message || "Nenhuma mensagem"}
                    </p>

                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="list-right">
                  <span
                    className={`list-status ${getStatusClass(request.status)}`}
                  >
                    {getStatusLabel(request.status)}
                  </span>

                  <div className="list-actions">
                    <button
                      className="btn btn-neutral"
                      onClick={() => navigate(`/pets/${request.pet?._id}`)}
                    >
                      Ver pet
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
