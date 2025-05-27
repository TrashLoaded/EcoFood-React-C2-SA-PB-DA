import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  addEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../services/empresaFirebase";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaActiva, setEmpresaActiva] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const guardar = async () => {
    try {
      const { nombre, rut, email, password } = formData;

      if (!nombre || !rut || !email) {
        Swal.fire("Campos obligatorios", "Nombre, RUT y Email son requeridos.", "warning");
        return;
      }

      if (!empresaActiva && !password) {
        Swal.fire("Falta contraseña", "Debes ingresar una contraseña para la nueva empresa.", "warning");
        return;
      }

      if (empresaActiva) {
        await updateEmpresa(empresaActiva.id, formData);
      } else {
        await addEmpresa(formData);
      }

      setShowModal(false);
      setEmpresaActiva(null);
      setFormData({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: "",
      });

      await cargarEmpresas();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al guardar.", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      await deleteEmpresa(id);
      await cargarEmpresas();
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="mb-3">Empresas Registradas</h3>
        <button
          className="btn btn-primary mb-3"
          onClick={() => {
            setEmpresaActiva(null);
            setFormData({
              nombre: "",
              rut: "",
              direccion: "",
              comuna: "",
              email: "",
              telefono: "",
              password: "",
            });
            setShowModal(true);
          }}
        >
          Nueva Empresa
        </button>

        <div style={{ overflowX: "auto" }}>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Comuna</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.rut}</td>
                  <td>{e.comuna}</td>
                  <td>{e.email}</td>
                  <td>{e.telefono}</td>
                 <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setEmpresaActiva(e);
                      setFormData({ ...e, password: "" });
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(e.id)}
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
                  {empresaActiva ? "Editar Empresa" : "Nueva Empresa"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {["nombre", "rut", "direccion", "comuna", "email", "telefono"].map((campo) => (
                  <input
                    key={campo}
                    className="form-control mb-2"
                    placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                    value={formData[campo]}
                    onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
                  />
                ))}
                {!empresaActiva && (
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
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={guardar}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
