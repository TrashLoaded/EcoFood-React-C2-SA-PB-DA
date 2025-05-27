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

  const guardar = async () => {
    if (clienteActivo) {
      await updateCliente(clienteActivo.id, formData);
    } else {
      try {
        await registrarClienteConAuth(formData);
        Swal.fire(
          "Cliente registrado",
          "Se envió un correo de verificación",
          "success"
        );
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
    setShowModal(false);
    setFormData({ nombre: "", email: "", comuna: "", password: "" });
    cargarClientes();
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
    <div className="container mt-4">
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="mb-3">Clientes Registrados</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            setClienteActivo(null);
            setFormData({ nombre: "", email: "", comuna: "", password: "" });
            setShowModal(true);
          }}
        >
          Nuevo Cliente
        </button>
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
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => eliminar(c.id)}
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
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={clienteActivo !== null}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                />
                {!clienteActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
