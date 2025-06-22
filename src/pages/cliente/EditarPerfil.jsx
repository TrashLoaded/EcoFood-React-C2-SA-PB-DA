import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCliente, updateCliente } from "../../services/clienteService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const [clienteId, setClienteId] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    comuna: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setClienteId(user.uid);
      } else {
        setClienteId(null);
        setCliente(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!clienteId) return;

    const cargar = async () => {
      try {
        const data = await getCliente();
        if (data) {
          setCliente(data);
          setFormData({
            nombre: data.nombre || "",
            direccion: data.direccion || "",
            comuna: data.comuna || ""
          });
        }
      } catch (error) {
        console.error("Error al cargar cliente:", error);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      }
    };
    cargar();
  }, [clienteId]);

  const guardarCambios = async () => {
    if (!formData.nombre.trim()) {
      Swal.fire("Error", "El nombre es obligatorio", "warning");
      return;
    }
    if (!formData.comuna.trim()) {
      Swal.fire("Error", "La comuna es obligatoria", "warning");
      return;
    }
    if (!formData.direccion.trim()) {
      Swal.fire("Error", "La dirección es obligatoria", "warning");
      return;
    }

    try {
      await updateCliente(formData);
      Swal.fire("Guardado", "Datos actualizados con éxito", "success");
      setCliente({ ...cliente, ...formData });
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      comuna: cliente.comuna
    });
    setEditando(false);
  };

  if (!clienteId) {
    return (
      <div className="text-center mt-5 fs-5">
        Por favor inicia sesión para ver tu perfil.
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center mt-5 fs-5">Cargando perfil...</div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Perfil del Cliente</h2>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Nombre</label>
          {editando ? (
            <input
              type="text"
              className="form-control"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              minLength={2}
              maxLength={30}
            />
          ) : (
            <p>{cliente.nombre}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Correo</label>
          <input className="form-control" value={cliente.email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Dirección</label>
          {editando ? (
            <input
              type="text"
              className="form-control"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              minLength={2}
              maxLength={20}
            />
          ) : (
            <p>{cliente.direccion}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Comuna</label>
          {editando ? (
            <select
              className="form-select"
              value={formData.comuna}
              onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
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
            <p>{cliente.comuna}</p>
          )}
        </div>

        {editando ? (
          <div className="d-flex gap-2">
            <button className="btn btn-success w-100" onClick={guardarCambios}>
              Guardar
            </button>
            <button className="btn btn-secondary w-100" onClick={cancelarEdicion}>
              Cancelar
            </button>
          </div>
        ) : (
            <div className="d-flex gap-2">
                <button className="btn btn-dark w-50" onClick={() => setEditando(true)}>
                    Editar Perfil
                </button>
                <button className="btn btn-secondary w-50" onClick={() => navigate("/cliente/home")}>
                    Volver al Home
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
