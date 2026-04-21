import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/pets" className="site-logo">
          AdotaPet
        </Link>

        <nav className="site-nav">
          <Link to="/pets">Pets</Link>
          <Link to="/dashboard">Minha área</Link>
        </nav>

        <div className="site-user">
          <span>Olá, {user?.name || "usuário"}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
