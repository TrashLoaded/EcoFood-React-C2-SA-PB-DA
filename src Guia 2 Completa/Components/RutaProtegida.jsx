import { Navigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!usuario) return <Navigate to="/login" />;

  return children;
}
