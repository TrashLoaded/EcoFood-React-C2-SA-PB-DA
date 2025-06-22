import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function HomeCliente() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-5" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold text-success">¡Bienvenido a EcoFood!</h2>
        <div className="d-grid gap-3">
          <button className="btn btn-primary" onClick={() => navigate("/cliente/productos")}>
            🛒 Ver Productos
          </button>
          <button className="btn btn-success" onClick={() => navigate("/cliente/pedidos")}>
            📦 Mis Pedidos
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/cliente/perfil")}>
            👤 Editar Perfil
          </button>
          <hr />
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
