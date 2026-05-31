import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function AdoptionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      const res = await api.get("/adoptions/received");
      setRequests(res.data);
    } catch (err) {
      toast.error("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function approveRequest(id) {
    try {
      await api.put(`/adoptions/${id}/approve`);

      toast.success("Solicitação aprovada");

      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao aprovar solicitação");
    }
  }

  async function rejectRequest(id) {
    try {
      await api.put(`/adoptions/${id}/reject`);

      toast.success("Solicitação rejeitada");

      loadRequests();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erro ao rejeitar solicitação",
      );
    }
  }

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Solicitações de adoção</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : requests.length === 0 ? (
          <p>Nenhuma solicitação encontrada.</p>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="content-card request-card">
              <img
                className="request-image"
                src={request.pet?.image || "/images/pet-placeholder.jpg"}
                alt={request.pet?.name}
              />

              <div className="request-content">
                <h3>{request.pet?.name}</h3>

                <p>
                  <strong>Solicitante:</strong> {request.requester?.name}
                </p>

                <p>
                  <strong>Email:</strong> {request.requester?.email}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                </p>

                <div className="request-message">
                  <strong>Mensagem:</strong>
                  <p>{request.message || "Nenhuma mensagem enviada."}</p>
                </div>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge status-${request.status}`}>
                    {request.status}
                  </span>
                </p>

                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => approveRequest(request._id)}
                    >
                      Aprovar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => rejectRequest(request._id)}
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
