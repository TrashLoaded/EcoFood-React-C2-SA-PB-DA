import React, { useEffect, useState } from "react";
import {
  getEmpresaById,
  updateEmpresa,
  getProductosByEmpresaId,
} from "../../services/empresaService";
import Swal from "sweetalert2";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilEmpresa() {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    comuna: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmpresaId(user.uid);
        localStorage.setItem("empresaId", user.uid);
      } else {
        setEmpresaId(null);
        setEmpresa(null);
        localStorage.removeItem("empresaId");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!empresaId) return;

    const cargarEmpresa = async () => {
      try {
        const data = await getEmpresaById(empresaId);
        if (data) {
          setEmpresa(data);
          setFormData({
            nombre: data.nombre || "",
            comuna: data.comuna || "",
          });
        } else {
          setEmpresa(null);
        }
      } catch (error) {
        console.error("Error al cargar empresa:", error);
        Swal.fire("Error", "No se pudo cargar el perfil de la empresa", "error");
      }
    };

    cargarEmpresa();
  }, [empresaId]);

  useEffect(() => {
    if (!empresaId) return;

    const cargarProductos = async () => {
      try {
        const data = await getProductosByEmpresaId(empresaId);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      }
    };

    cargarProductos();
  }, [empresaId]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const guardarCambios = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire("Error", "El nombre es obligatorio", "warning");
      return;
    }
    if (!formData.comuna.trim()) {
      Swal.fire("Error", "La ubicación es obligatoria", "warning");
      return;
    }
    try {
      await updateEmpresa(empresaId, {
        nombre: formData.nombre,
        comuna: formData.comuna,
      });
      Swal.fire("Guardado", "Datos actualizados con éxito", "success");
      setEmpresa({ ...empresa, ...formData });
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: empresa.nombre,
      comuna: empresa.comuna,
    });
    setEditando(false);
  };

  if (!empresaId) {
    return (
      <div className="text-center mt-5 fs-5">
        Por favor inicia sesión para ver tu perfil.
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="text-center mt-5 fs-5">Cargando perfil...</div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="card mb-4 shadow-sm p-2">
        <div className="card-body d-flex justify-content-between align-items-center">
          <h2 className="fw-bold mb-0">Perfil de Empresa</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="d-flex">
        <div
          className="card shadow p-4"
          style={{ width: "400px", minHeight: "500px", marginRight: "1.5rem" }}
        >
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre</label>
            {editando ? (
              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                minLength={2}
                maxLength={60}
              />
            ) : (
              <p>{empresa.nombre}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Correo</label>
            <input className="form-control" value={empresa.email} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">RUT</label>
            <input className="form-control" value={empresa.rut || ""} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Ubicación</label>
            {editando ? (
               <select
               className="form-select"
               value={formData.comuna}
               onChange={(e) =>
                setFormData({ ...formData, comuna: e.target.value })
              }
               required
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
            ) : (
              <p>{empresa.comuna}</p>
            )}
          </div>

          {editando ? (
            <div className="d-flex gap-2">
              <button className="btn btn-success w-100" onClick={guardarCambios}>
                Guardar
              </button>
              <button
                className="btn btn-secondary w-100"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              className="btn btn-dark w-100"
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </button>
          )}
        </div>

        <div className="flex-grow-1">
          <div className="card mb-4 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-0">
              <h4 className="fw-bold mb-2 m-1">Productos</h4>
              <button
                className="btn btn-success p-10"
                onClick={() =>
                  navigate("/empresa/productos", { state: { empresaId } })
                }
              >
                Gestión de Productos
              </button>
            </div>
          </div>
          
          <div
            className="border rounded p-3"
            style={{
              minHeight: "250px",
              backgroundColor: "#f8f9fa",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <p className="card p-2 fw-semibold mb-3">Primeros dos productos ingresados.</p>
            {productos.length > 0 ? (
              <div className="d-flex flex-row" style={{ gap: "1rem" }}>
                {productos.slice(0, 2).map((producto) => (
                  <div
                    key={producto.id}
                    className="card"
                    style={{
                      minWidth: "250px",
                      maxWidth: "250px",
                      flex: "0 0 auto",
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-wrap">{producto.nombre}</h5>
                      <p className="card-text text-truncate">{producto.descripcion}</p>
                      <p className="text-muted mb-0">Precio: ${producto.precio}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No hay productos para mostrar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
