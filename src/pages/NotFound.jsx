import { useNavigate } from "react-router-dom";
import "../styles/FormPages.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="display-4 animate__animated animate__fadeIn">404</h1>
        <p className="lead animate__animated animate__fadeIn">Ruta no encontrada</p>
        <button
          className="btn custom-btn-green w-100 animate__animated animate__fadeIn"
          onClick={() => navigate("/login")}
        >
          Volver al login
        </button>
      </div>
    </div>
  );
}
