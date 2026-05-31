import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path ? "active-link" : "";
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-link">
          AdotaPet
        </Link>

        <nav className="navbar-links">
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            Início
          </Link>

          {token && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard")}`}
              >
                Painel
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/cadastrar-pet"
                    className={`nav-link ${isActive("/cadastrar-pet")}`}
                  >
                    Cadastrar Pet
                  </Link>

                  <Link
                    to="/my-pets"
                    className={`nav-link ${isActive("/my-pets")}`}
                  >
                    Meus Pets
                  </Link>

                  <Link
                    to="/adoption-requests"
                    className={`nav-link ${isActive("/adoption-requests")}`}
                  >
                    Solicitações
                  </Link>
                </>
              )}

              {!isAdmin && (
                <Link
                  to="/my-adoptions"
                  className={`nav-link ${isActive("/my-adoptions")}`}
                >
                  Minhas Adoções
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="navbar-user-area">
          {token ? (
            <>
              <span className="nav-user-name">Olá, {user?.name}</span>

              <button className="logout-button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
