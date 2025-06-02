import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/adminFirebase";
import { getAuth } from "firebase/auth";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    isPrincipal: false,
  });
  const [showModal, setShowModal] = useState(false);

  const auth = getAuth();
  const usuarioActual = auth.currentUser;

  const UID_ADMIN_PRINCIPAL = "WQzx3NxUVAZWHYNqNysNfqp2g9G2";

  const cargarAdmins = async () => {
    const data = await getAdministradores();
    setAdmins(data);
  };

  const resetForm = () => {
    setFormData({ nombre: "", email: "", password: "", isPrincipal: false });
    setAdminActivo(null);
  };

  const guardar = async () => {
    const { nombre, email, password, isPrincipal } = formData;

    if (!nombre || !email) {
      Swal.fire("Campos obligatorios", "Nombre y email son requeridos", "warning");
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

    if (!adminActivo) {
      if (!password) {
        Swal.fire("Falta contraseña", "Debes ingresar una contraseña para el nuevo administrador.", "warning");
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

    let nuevoIsPrincipal = isPrincipal;
    if (usuarioActual?.uid !== UID_ADMIN_PRINCIPAL) {
      nuevoIsPrincipal = adminActivo ? adminActivo.isPrincipal : false;
    }

    try {
      if (nuevoIsPrincipal) {
        for (const admin of admins) {
          if (admin.isPrincipal && admin.id !== adminActivo?.id) {
            await updateAdmin(admin.id, { isPrincipal: false });
          }
        }
      }

      const datosParaGuardar = {
        ...formData,
        isPrincipal: nuevoIsPrincipal,
      };

      if (adminActivo) {
        await updateAdmin(adminActivo.id, datosParaGuardar);
      } else {
        await registrarAdmin(datosParaGuardar);
      }

      setShowModal(false);
      resetForm();
      await cargarAdmins();
      Swal.fire("Éxito", "Administrador guardado correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
      console.error(error);
    }
  };

  const eliminar = async (id) => {
    const adminPrincipal = admins.find((a) => a.isPrincipal);
    if (adminPrincipal && id === adminPrincipal.id) {
      Swal.fire(
        "Prohibido",
        "No puedes eliminar al administrador principal.",
        "error"
      );
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
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="card-title mb-2">Gestión de Administradores</h2>
        <p className="text-muted mb-4">
          Listado y administración de administradores del sistema
        </p>

        <div style={{ overflowX: "auto" }}>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Principal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No hay administradores registrados.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.nombre}</td>
                    <td>{admin.email}</td>
                    <td>{admin.isPrincipal ? "Sí" : "No"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setAdminActivo(admin);
                            setFormData({
                              ...admin,
                              password: "",
                              isPrincipal: !!admin.isPrincipal,
                            });
                            setShowModal(true);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminar(admin.id)}
                        >
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

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Nuevo Administrador
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
                  {adminActivo ? "Editar Administrador" : "Nuevo Administrador"}
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
                  disabled={adminActivo !== null}
                  minLength={5}
                  maxLength={50}
                />
                {!adminActivo && (
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

                {usuarioActual?.uid === UID_ADMIN_PRINCIPAL ? (
                  <div className="form-check mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="principalCheckbox"
                      checked={formData.isPrincipal}
                      onChange={(e) =>
                        setFormData({ ...formData, isPrincipal: e.target.checked })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="principalCheckbox"
                    >
                      Marcar como administrador principal
                    </label>
                  </div>
                ) : (
                  <p className="text-muted fst-italic mt-3">
                    Solo el administrador principal puede cambiar esta opción.
                  </p>
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
