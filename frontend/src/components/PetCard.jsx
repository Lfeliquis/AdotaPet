import { useNavigate } from "react-router-dom";

export default function PetCard({ pet }) {
  const navigate = useNavigate();

  return (
    <div className="pet-card" onClick={() => navigate(`/pets/${pet._id}`)}>
      <div className="pet-image">
        <img
          src={pet.image || "https://via.placeholder.com/400x260?text=Pet"}
          alt={pet.name}
        />
        <span
          className={`pet-badge ${
            pet.status === "adopted" ? "adopted" : "available"
          }`}
        >
          {pet.status === "adopted" ? "Adotado" : "Disponível"}
        </span>
      </div>

      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p>
          {pet.species || "Pet"} {pet.breed ? `• ${pet.breed}` : ""}
        </p>
        <p>{pet.age ? `${pet.age} anos` : "Idade não informada"}</p>
        <button
          className="details-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/pets/${pet._id}`);
          }}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
