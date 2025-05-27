import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD

export default function ProtectedByRole({ allowed, children }) {
  const { userData, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!userData || !allowed.includes(userData.tipo)) {
    return <Navigate to="/login" />;
  }

  return children;
=======
export default function ProtectedByRole({ allowed, children }) {
const { userData, loading } = useAuth();
if (loading) return <p>Cargando...</p>;
if (!userData || !allowed.includes(userData.tipo)) {
return <Navigate to="/login" />;
}
return children;
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2
}
