import React, { useEffect, useState } from "react";
import { getEmpresaById, updateEmpresa } from "../../services/empresaService";
import Swal from "sweetalert2";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilEmpresa() {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
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

    const cargar = async () => {
      try {
        const data = await getEmpresaById(empresaId);
        if (data) {
          setEmpresa(data);
          setFormData({
            nombre: data.nombre || "",
            direccion: data.direccion || "",
          });
        } else {
          setEmpresa(null);
        }
      } catch (error) {
        console.error("Error al cargar empresa:", error);
        Swal.fire("Error", "No se pudo cargar el perfil de la empresa", "error");
      }
    };
    cargar();
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
    if (!formData.direccion.trim()) {
      Swal.fire("Error", "La ubicación es obligatoria", "warning");
      return;
    }
    try {
      await updateEmpresa(empresaId, {
        nombre: formData.nombre,
        direccion: formData.direccion,
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
      direccion: empresa.direccion,
    });
    setEditando(false);
  };

  if (!empresaId)
    return (
      <div className="text-center mt-5 fs-5">
        Por favor inicia sesión para ver tu perfil.
      </div>
    );
  if (!empresa)
    return (
      <div className="text-center mt-5 fs-5">
        Cargando perfil...
      </div>
    );

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div
        className="card shadow-lg p-5 rounded-4 border border-success"
        style={{ backgroundColor: "#f9faff" }}
      >
        <h1
          className="mb-4 text-dark text-center"
          style={{ fontWeight: "700", fontSize: "2.5rem", letterSpacing: "1.2px" }}
        >
          Perfil de Empresa
        </h1>

        <div className="mb-4">
          <label className="form-label fw-bold fs-5">Nombre</label>
          {editando ? (
            <input
              type="text"
              className="form-control form-control-lg"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              minLength={2}
              maxLength={50}
              autoFocus
            />
          ) : (
            <p className="fs-5">{empresa.nombre}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold fs-5">Correo</label>
          <input
            className="form-control form-control-lg"
            value={empresa.email}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold fs-5">RUT</label>
          <input
            className="form-control form-control-lg"
            value={empresa.rut || ""}
            disabled
          />
        </div>

        <div className="mb-5">
          <label className="form-label fw-bold fs-5">Ubicación</label>
          {editando ? (
            <input
              type="text"
              className="form-control form-control-lg"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              minLength={2}
              maxLength={100}
            />
          ) : (
            <p className="fs-5">{empresa.direccion}</p>
          )}
        </div>

        {editando ? (
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-success btn-lg px-4"
              onClick={guardarCambios}
            >
              Guardar
            </button>
            <button
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-dark btn-lg px-5"
              onClick={() => setEditando(true)}
            >
              Editar Perfil
            </button>
            <button className="btn btn-danger btn-lg px-5" onClick={handleLogout}>
              Cerrar sesión
            </button>
            <button
              className="btn btn-success btn-lg px-5"
              onClick={() => navigate("/empresa/productos", {state: { empresaId} })}
            >
              Gestión de Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
