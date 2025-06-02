import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getEmpresas,
  addEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../services/empresaFirebase";

function validarFormatoRut(rut) {
  const regex = /^[0-9]{7,8}-[0-9Kk]$/;
  return regex.test(rut);
}

function validarPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{6,}$/;
  return regex.test(password);
}

const comunasDisponibles = [
  "Andacollo", "Coquimbo", "La Serena", "La Higuera", "Paihuano", "Vicuña",
  "Combarbalá", "Monte Patria", "Ovalle", "Punitaqui", "Río Hurtado",
  "Canela", "Illapel", "Los Vilos", "Salamanca"
];

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
  const [guardando, setGuardando] = useState(false);

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const guardar = async () => {
    if (guardando) return;
    setGuardando(true);

    try {
      const { nombre, rut, direccion, comuna, email, telefono, password } = formData;

      if (!nombre || nombre.length < 3) {
        Swal.fire("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "warning");
        return;
      }

      if (!rut || !validarFormatoRut(rut)) {
        Swal.fire("RUT inválido", "Debes ingresar un RUT con formato válido (7 u 8 números, guion y dígito verificador).", "warning");
        return;
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        Swal.fire("Email inválido", "Debes ingresar un correo electrónico válido.", "warning");
        return;
      }

      if (!direccion || direccion.length < 5) {
        Swal.fire("Dirección inválida", "La dirección debe tener al menos 5 caracteres.", "warning");
        return;
      }

      if (!comuna) {
        Swal.fire("Comuna requerida", "Debes seleccionar una comuna.", "warning");
        return;
      }

      if (!telefono || telefono.length < 6) {
        Swal.fire("Teléfono inválido", "El teléfono debe tener al menos 6 dígitos.", "warning");
        return;
      }

      if (!empresaActiva) {
        if (!password) {
          Swal.fire("Contraseña requerida", "Debes ingresar una contraseña.", "warning");
          return;
        }

        if (!validarPassword(password)) {
          Swal.fire(
            "Contraseña insegura",
            "Debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
            "warning"
          );
          return;
        }
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
      Swal.fire("Éxito", "La empresa fue guardada correctamente.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al guardar.", "error");
    } finally {
      setGuardando(false);
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
    <div className="container-fluid mt-4">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h3 className="mb-3">Empresas Registradas</h3>
        <p className="text-muted mb-4">Listado y administración de empresas registradas en EcoFood</p>
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
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay empresas registradas aún.
                  </td>
                </tr>
              ) : (
                empresas.map((e) => (
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
                        <button className="btn btn-danger btn-sm" onClick={() => eliminar(e.id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary"
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
                  {empresaActiva ? "Editar Empresa" : "Nueva Empresa"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  minLength={2}
                  maxLength={60}
                />

                <input
                  className="form-control mb-2"
                  placeholder="RUT"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  disabled={!!empresaActiva}
                  minLength={2}
                  maxLength={11}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  minLength={2}
                  maxLength={30}
                />

                <select
                  className="form-control mb-2"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                >
                  <option value="">-- Selecciona una comuna --</option>
                  {comunasDisponibles.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>

                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  minLength={2}
                  maxLength={60}
                  disabled={!!empresaActiva}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  min={1}
                  maxLength={11}
                />

                {!empresaActiva && (
                  <>
                    <input
                      type="password"
                      className="form-control mb-1"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={6}
                      maxLength={20}
                    />
                    <small className="text-muted mb-2 d-block">
                      La contraseña debe tener al menos 6 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.
                    </small>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar} disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
