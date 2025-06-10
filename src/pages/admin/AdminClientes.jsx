import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente,
  deleteCliente,
  registrarClienteConAuth,
} from "../../services/clienteFirebase";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    password: "",
  });

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const resetForm = () => {
    setFormData({ nombre: "", email: "", comuna: "", password: "" });
    setClienteActivo(null);
  };

  const guardar = async () => {
    const { nombre, email, comuna, password } = formData;

    if (!nombre || !email || !comuna) {
      Swal.fire("Campos obligatorios", "Nombre, email y comuna son requeridos", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire("Email inválido", "Por favor ingresa un email válido", "warning");
      return;
    }

    if (nombre.length < 2 || nombre.length > 50) {
      Swal.fire("Nombre inválido", "El nombre debe tener entre 2 y 50 caracteres", "warning");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!clienteActivo) {
      if (!password) {
        Swal.fire("Falta contraseña", "Debes ingresar una contraseña para el nuevo cliente.", "warning");
        return;
      }
      if (!passwordRegex.test(password)) {
        Swal.fire(
          "Contraseña insegura.",
          "La contraseña debe tener mínimo 6 carácteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.",
          "warning"
        );
        return;
      }
    }

    try {
      if (clienteActivo) {
        await updateCliente(clienteActivo.id, formData);
      } else {
        await registrarClienteConAuth(formData);
        Swal.fire(
          "Cliente registrado",
          "Se envió un correo de verificación al cliente",
          "success"
        );
      }

      setShowModal(false);
      resetForm();
      cargarClientes();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      await deleteCliente(id);
      cargarClientes();
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="card-title mb-2">Gestión de Clientes</h2>
        <p className="text-muted mb-4">Listado y administración de clientes registrados en EcoFood</p>

        <div style={{ overflowX: "auto" }}>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Comuna</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.email}</td>
                  <td>{c.comuna}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setClienteActivo(c);
                          setFormData({ ...c, password: "" });
                          setShowModal(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminar(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Nuevo Cliente
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  minLength={2}
                  maxLength={50}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={clienteActivo !== null}
                  minLength={5}
                  maxLength={50}
                />
                <select
                  className="form-select mb-2"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                >
                  <option value="">-- Selecciona una comuna --</option>
                  <option value="Andacollo">Andacollo</option>
                  <option value="Coquimbo">Coquimbo</option>
                  <option value="La Serena">La Serena</option>
                  <option value="La Higuera">La Higuera</option>
                  <option value="Paihuano">Paihuano</option>
                  <option value="Vicuña">Vicuña</option>
                  <option value="Combarbalá">Combarbalá</option>
                  <option value="Monte Patria">Monte Patria</option>
                  <option value="Ovalle">Ovalle</option>
                  <option value="Punitaqui">Punitaqui</option>
                  <option value="Río Hurtado">Río Hurtado</option>
                  <option value="Canela">Canela</option>
                  <option value="Illapel">Illapel</option>
                  <option value="Los Vilos">Los Vilos</option>
                  <option value="Salamanca">Salamanca</option>
                </select>
                {!clienteActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    minLength={6}
                    maxLength={20}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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
