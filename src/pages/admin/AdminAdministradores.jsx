import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/adminFirebase";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [showModal, setShowModal] = useState(false);

  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const guardar = async () => {
    try {
      const { email, nombre, password } = formData;

      if (!email || !nombre) {
        Swal.fire("Campos obligatorios", "Email y nombre son requeridos", "warning");
        return;
      }

      if (!adminActivo && !password) {
        Swal.fire("Falta contraseña", "Debes ingresar una contraseña para el nuevo administrador.", "warning");
        return;
      }

      if (adminActivo) {
        await updateAdmin(adminActivo.id, { nombre });
      } else {
        await registrarAdmin(formData);
      }

      setShowModal(false);
      setFormData({ nombre: "", email: "", password: "" });
      await cargarAdmins();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
      console.error(error);
    }
  };

  const eliminar = async (id) => {
    const adminPrincipal = admins[0];
    if (id === adminPrincipal.id) {
      Swal.fire("Prohibido", "No puedes eliminar al administrador principal.", "error");
      return;
    }

    const res = await Swal.fire({
      title: "¿Eliminar administrador?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      icon: "warning",
    });

    if (res.isConfirmed) {
      await deleteAdmin(id);
      await cargarAdmins();
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="mb-3">Administradores del sistema</h3>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setAdminActivo(null);
          setFormData({ nombre: "", email: "", password: "" });
          setShowModal(true);
        }}
      >
        Nuevo Administrador
      </button>
    <div style={{ overflowX: "auto" }}>
      <table className="table table-striped">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.email}</td>
              <td>
                <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setAdminActivo(admin);
                    setFormData({ ...admin, password: "" });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => eliminar(admin.id)}
                >
                  Eliminar
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{adminActivo ? "Editar Admin" : "Nuevo Admin"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={adminActivo !== null}
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
