import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormSkeleton from "../components/FormSkeleton";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    species: "",
    breed: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await api.get(`/pets/${id}`);
        const pet = res.data;

        setForm({
          name: pet.name || "",
          age: pet.age || "",
          species: pet.species || "",
          breed: pet.breed || "",
          description: pet.description || "",
        });

        if (pet.image) {
          setPreview(pet.image);
        }
      } catch (err) {
        console.error("Erro ao carregar pet:", err);
        setError(err.response?.data?.message || "Erro ao carregar pet");
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/pets/${id}`, formData);

      toast.success("Pet atualizado com sucesso ✏️");
      navigate("/my-pets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao atualizar pet");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="form-shell">
        <div className="form-card">
          <h2>Editar pet ✏️</h2>

          {loading ? (
  <FormSkeleton />
) : (
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Nome do pet"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="species"
                placeholder="Espécie"
                value={form.species}
                onChange={handleChange}
                required
              />

              <input
                name="breed"
                placeholder="Raça"
                value={form.breed}
                onChange={handleChange}
              />

              <input
                name="age"
                type="number"
                placeholder="Idade"
                value={form.age}
                onChange={handleChange}
              />

              <textarea
                name="description"
                placeholder="Descrição"
                value={form.description}
                onChange={handleChange}
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {preview && <img src={preview} alt="Preview do pet" />}

              {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

              <button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}