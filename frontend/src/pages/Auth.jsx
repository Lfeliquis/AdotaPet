import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }

  .auth-page {
    background: linear-gradient(to right, #faf0e6, #fde8d8);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .auth-container {
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.35);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
  }

  .auth-container p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
  }

  .auth-container span {
    font-size: 12px;
  }

  .auth-container a {
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
  }

  .auth-container button {
    background-color: #e8541a;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .auth-container button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .auth-container button.hidden-btn {
    background-color: transparent;
    border-color: #fff;
  }

  .auth-container form {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
  }

  .auth-container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
    transition: background 0.2s;
  }

  .auth-container input:focus {
    background-color: #fde8d8;
  }

  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }

  .sign-in {
    left: 0;
    width: 50%;
    z-index: 2;
  }

  .auth-container.active .sign-in {
    transform: translateX(100%);
  }

  .sign-up {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }

  .auth-container.active .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move 0.6s;
  }

  @keyframes move {
    0%, 49.99% { opacity: 0; z-index: 1; }
    50%, 100%  { opacity: 1; z-index: 5; }
  }

  .social-icons {
    margin: 20px 0;
  }

  .social-icons a {
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
  }

  .toggle-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
  }

  .auth-container.active .toggle-container {
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
  }

  .toggle {
    background: linear-gradient(to right, #f07040, #e8541a);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
  }

  .auth-container.active .toggle {
    transform: translateX(50%);
  }

  .toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transition: all 0.6s ease-in-out;
  }

  .toggle-left {
    transform: translateX(-200%);
  }

  .auth-container.active .toggle-left {
    transform: translateX(0);
  }

  .toggle-right {
    right: 0;
    transform: translateX(0);
  }

  .auth-container.active .toggle-right {
    transform: translateX(200%);
  }
`;

const SocialIcons = () => (
  <div className="social-icons">
    <a href="#">
      <i className="fa-brands fa-google-plus-g"></i>
    </a>
    <a href="#">
      <i className="fa-brands fa-facebook-f"></i>
    </a>
    <a href="#">
      <i className="fa-brands fa-github"></i>
    </a>
    <a href="#">
      <i className="fa-brands fa-linkedin-in"></i>
    </a>
  </div>
);

function Auth() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  function handleLoginChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  function handleRegisterChange(e) {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const response = await api.post("/login", {
        email: loginData.email,
        senha: loginData.password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login realizado com sucesso! 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao autenticar");
    } finally {
      setLoadingLogin(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoadingRegister(true);
    try {
      const response = await api.post("/register", {
        name: registerData.name,
        email: registerData.email,
        senha: registerData.password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Conta criada com sucesso! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoadingRegister(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      {/* Font Awesome — remova se já estiver no index.html */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />

      <div className="auth-page">
        <div className={`auth-container${isActive ? " active" : ""}`}>
          {/* ── Cadastro ── */}
          <div className="form-container sign-up">
            <form onSubmit={handleRegister}>
              <h1>Criar Conta</h1>
              <span>ou use seu e-mail para se registrar</span>
              <input
                name="name"
                type="text"
                placeholder="Nome"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <button type="submit" disabled={loadingRegister}>
                {loadingRegister ? "Carregando..." : "Cadastrar"}
              </button>
            </form>
          </div>

          {/* ── Login ── */}
          <div className="form-container sign-in">
            <form onSubmit={handleLogin}>
              <h1>Entrar</h1>
              <span>ou use seu e-mail e senha</span>
              <input
                name="email"
                type="email"
                placeholder="E-mail"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <a href="#">Esqueceu sua senha?</a>
              <button type="submit" disabled={loadingLogin}>
                {loadingLogin ? "Carregando..." : "Entrar"}
              </button>
            </form>
          </div>

          {/* ── Painel animado ── */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Bem-vindo de volta!</h1>
                <p>
                  Insira seus dados pessoais para usar todos os recursos do site
                </p>
                <button
                  className="hidden-btn"
                  onClick={() => setIsActive(false)}
                >
                  Entrar
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Olá, amigo!</h1>
                <p>
                  Registre-se com seus dados pessoais para usar todos os
                  recursos do site
                </p>
                <button
                  className="hidden-btn"
                  onClick={() => setIsActive(true)}
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
