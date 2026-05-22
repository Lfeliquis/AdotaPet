import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const response = await api.get("/adoptions/received");

      setRequests(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function approveRequest(id) {
    try {
      await api.put(`/adoptions/${id}/approve`);

      toast.success("Solicitação aprovada");

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao aprovar");
    }
  }

  async function rejectRequest(id) {
    try {
      await api.put(`/adoptions/${id}/reject`);

      toast.success("Solicitação rejeitada");

      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao rejeitar");
    }
  }

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Solicitações recebidas</h1>

        {requests.length === 0 && <p>Nenhuma solicitação recebida</p>}

        {requests.map((request) => (
          <div className="request-card" key={request._id}>
            <h3>{request.pet?.name}</h3>

            <p>Solicitante: {request.requester?.name}</p>

            <p>Email: {request.requester?.email}</p>

            <p>Status: {request.status}</p>

            <p>Mensagem: {request.message}</p>

            {request.status === "pending" && (
              <div className="request-actions">
                <button onClick={() => approveRequest(request._id)}>
                  Aprovar
                </button>

                <button onClick={() => rejectRequest(request._id)}>
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
