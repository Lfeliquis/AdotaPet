import "./Auth.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? {
            email: formData.email,
            senha: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            senha: formData.password,
          };

      const response = await api.post(endpoint, payload);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(
        isLogin
          ? "Login realizado com sucesso! 👋"
          : "Conta criada com sucesso! 🎉",
      );

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              name="name"
              placeholder="Nome"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p>
          {isLogin ? "Não tem conta?" : "Já tem conta?"}
          <span className="auth-link" onClick={toggleMode}>
            {isLogin ? " Cadastre-se" : " Entrar"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
