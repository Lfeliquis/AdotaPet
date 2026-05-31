import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageContainer from "../components/PageContainer";
import api from "../services/api";

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  function getStatusText(status) {
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
        return "rejected";
      default:
        return "pending";
    }
  }

  return (
    <>
      <Navbar />

      <PageContainer title="Minhas Solicitações" emoji="📋">
        {loading ? (
          <p>Carregando...</p>
        ) : requests.length === 0 ? (
          <div className="empty-state-box">
            <p>Você ainda não realizou nenhuma solicitação.</p>

            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Ver Pets
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
                      <strong>Responsável:</strong> {request.owner?.name}
                    </p>

                    <p>
                      <strong>Mensagem:</strong> {request.message || "Nenhuma"}
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
                    {getStatusText(request.status)}
                  </span>

                  {request.pet && (
                    <button
                      className="btn btn-neutral"
                      onClick={() => navigate(`/pets/${request.pet._id}`)}
                    >
                      Ver Pet
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
