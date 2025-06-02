import { useNavigate } from "react-router-dom";
import "../index.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card text-center">
        <h1 className="display-4 animate__animated animate__fadeIn">404</h1>
        <p className="lead animate__animated animate__fadeIn">Ruta no encontrada</p>
        <button
          className="btn btn-success w-100 animate__animated animate__fadeIn"
          onClick={() => navigate("/login")}
        >
          Volver al login
        </button>
      </div>
    </div>
  );
}
