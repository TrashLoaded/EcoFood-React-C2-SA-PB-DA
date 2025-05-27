import { useEffect, useState } from "react";
import { getEmpresas } from "../../services/empresaFirebase";
import { getUsuariosPorTipo } from "../../services/clienteFirebase";
import { getAdministradores } from "../../services/adminFirebase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const empresas = await getEmpresas();
      const clientes = await getUsuariosPorTipo("cliente");
      const admins = await getAdministradores();

      setTotalEmpresas(empresas.length);
      setTotalClientes(clientes.length);
      setTotalAdmins(admins.length);
    };

    cargarDatos();
  }, []);

  return (
    <div className="container mt-5">
      <div className="bg-white shadow rounded p-4" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 className="mb-2">Panel del Administrador</h2>
        <p className="text-muted mb-4">Resumen del sistema EcoFood</p>

        <div className="d-flex gap-3 overflow-auto mb-4" style={{ flexWrap: "nowrap" }}>
  <div className="card h-100 border-0 shadow-sm bg-primary text-white" style={{ minWidth: "260px" }}>
    <div className="card-body text-center">
      <h5 className="card-title">Empresas registradas</h5>
      <p className="display-6">{totalEmpresas}</p>
    </div>
  </div>
  <div className="card h-100 border-0 shadow-sm bg-success text-white" style={{ minWidth: "260px" }}>
    <div className="card-body text-center">
      <h5 className="card-title">Clientes registrados</h5>
      <p className="display-6">{totalClientes}</p>
    </div>
  </div>
  <div className="card h-100 border-0 shadow-sm bg-warning text-dark" style={{ minWidth: "260px" }}>
    <div className="card-body text-center">
      <h5 className="card-title">Administradores activos</h5>
      <p className="display-6">{totalAdmins}</p>
    </div>
  </div>
</div>


        <hr />

        <h4 className="mb-3">Accesos rápidos</h4>
        <div className="d-flex flex-wrap gap-3 justify-content-center" style={{flexWrap: "nowrap"}}>
          <button className="btn btn-outline-primary px-4" onClick={() => navigate("/admin/empresas")}>
            Empresas
          </button>
          <button className="btn btn-outline-success px-4" onClick={() => navigate("/admin/clientes")}>
            Clientes
          </button>
          <button className="btn btn-outline-warning px-4" onClick={() => navigate("/admin/administradores")}>
            Administradores
          </button>
        </div>
      </div>
    </div>
  );
}

