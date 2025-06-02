import React, { useEffect, useState } from "react";
import { getEmpresaById, updateEmpresa } from "../../services/empresaService";
import Swal from "sweetalert2";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function PerfilEmpresa() {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    ubicacion: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmpresaId(user.uid);
      } else {
        setEmpresaId(null);
        setEmpresa(null);
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
            correo: data.correo || "",
            ubicacion: data.ubicacion || "",
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

  const guardarCambios = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire("Error", "El nombre es obligatorio", "warning");
      return;
    }
    if (!formData.ubicacion.trim()) {
      Swal.fire("Error", "La ubicación es obligatoria", "warning");
      return;
    }
    try {
      await updateEmpresa(empresaId, {
        nombre: formData.nombre,
        ubicacion: formData.ubicacion,
      });
      Swal.fire("Guardado", "Datos actualizados con éxito", "success");
      setEmpresa({ ...empresa, ...formData });
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  if (!empresaId) return <div>Por favor inicia sesión para ver tu perfil.</div>;
  if (!empresa) return <div>Cargando perfil...</div>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h3>Perfil de Empresa</h3>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          {editando ? (
            <input
              type="text"
              className="form-control"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              minLength={2}
              maxLength={50}
            />
          ) : (
            <p>{empresa.nombre}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <p>{empresa.correo}</p>
        </div>

        <div className="mb-3">
          <label className="form-label">Ubicación</label>
          {editando ? (
            <input
              type="text"
              className="form-control"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              minLength={2}
              maxLength={100}
            />
          ) : (
            <p>{empresa.ubicacion}</p>
          )}
        </div>

        {editando ? (
          <>
            <button className="btn btn-success me-2" onClick={guardarCambios}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => setEditando(true)}>
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  );
}
