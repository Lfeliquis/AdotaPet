import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function CreatePet() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    species: "",
    breed: "",
    description: "",
    size: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

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

      await api.post("/pets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Pet cadastrado com sucesso");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erro ao cadastrar pet");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="form-shell">
        <div className="form-card">
          <h2>Cadastrar novo pet</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Nome"
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
              required
            />

            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o porte</option>
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>

            <textarea
              name="description"
              placeholder="Descrição"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <img
                src={preview}
                alt="Preview do pet"
                style={{ width: "100%", marginTop: "10px" }}
              />
            )}

            <button type="submit" disabled={saving}>
              {saving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
