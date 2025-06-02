import { useNavigate } from 'react-router-dom';

export default function ClienteDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="card text-center">
        <h2 className="fw-bold mb-0">¡Bienvenido, Cliente!</h2>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
