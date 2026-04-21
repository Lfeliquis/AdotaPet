import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Entrar" : "Criar conta"}</h2>
        <p>
          {isLogin
            ? "Acesse sua conta para continuar"
            : "Cadastre-se para adotar ou divulgar pets"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </span>
      </div>
    </div>
  );
}
