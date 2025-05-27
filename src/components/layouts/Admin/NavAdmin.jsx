import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";

export default function NavAdmin() {
  const { userData } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-light border mb-4 shadow-sm">
      <div className="container-fluid rounded-3 px-4 py-2 bg-white">
        <span className="navbar-brand fw-bold">
          Ecofood Admin
          <small className="d-block text-muted" style={{ fontSize: "0.8rem" }}>
            {userData?.nombre}
          </small>
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/admin/dashboard" className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/empresas" className="nav-link">
                Empresas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/clientes" className="nav-link">
                Clientes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/administradores" className="nav-link">
                Administradores
              </NavLink>
            </li>
          </ul>

          <div className="ms-auto d-flex align-items-center">
            <CerrarSesion />
          </div>
        </div>
      </div>
    </nav>
  );
}
