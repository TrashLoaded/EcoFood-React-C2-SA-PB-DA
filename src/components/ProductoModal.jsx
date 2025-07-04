import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const estados = ["disponible", "agotado", "por vencer", "gratuito"];

export default function ProductoModal({ productoEditar, onGuardar, onCerrar }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: 1,
    precio: 0,
    estado: "disponible",
  });

  useEffect(() => {
    if (productoEditar) {
      setFormData(productoEditar);
    }
  }, [productoEditar]);

  useEffect(() => {
    if (formData.cantidad === 0 && formData.estado !== "agotado") {
      setFormData(prev => ({ ...prev, estado: "agotado" }));
    } else if (formData.cantidad > 0 && formData.estado === "agotado") {
      setFormData(prev => ({ ...prev, estado: "disponible" }));
    }
  }, [formData.cantidad]);

  const validar = () => {
    const { nombre, descripcion, vencimiento, cantidad, precio, estado } = formData;
    if (!nombre.trim()) {
      Swal.fire("Error", "El nombre es obligatorio", "warning");
      return false;
    }
    if (!descripcion.trim()) {
      Swal.fire("Error", "La descripción es obligatoria", "warning");
      return false;
    }
    if (!vencimiento) {
      Swal.fire("Error", "La fecha de vencimiento es obligatoria", "warning");
      return false;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVenc = new Date(vencimiento);
    fechaVenc.setHours(0, 0, 0, 0);
    if (fechaVenc < hoy) {
      Swal.fire("Error", "La fecha de vencimiento debe ser hoy o futura", "warning");
      return false;
    }
    if (cantidad < 0) {
      Swal.fire("Error", "La cantidad no puede ser negativa", "warning");
      return false;
    }
    if (precio < 0) {
      Swal.fire("Error", "El precio no puede ser negativo", "warning");
      return false;
    }
    if (!estados.includes(estado)) {
      Swal.fire("Error", "Estado inválido", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    onGuardar(formData);
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
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
              {productoEditar ? "Editar Producto" : "Nuevo Producto"}
            </h5>
            <button className="btn-close" onClick={onCerrar}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              minLength={2}
              maxLength={30}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              minLength={2}
              maxLength={100}
              rows={3}
            />
            <input
              type="date"
              className="form-control mb-2"
              value={formData.vencimiento}
              onChange={(e) =>
                setFormData({ ...formData, vencimiento: e.target.value })
              }
            />
            <small className="form-text text-muted">
              Cantidad
            </small>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Cantidad"
              min={0}
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: Number(e.target.value) })
              }
            />
            <small className="form-text text-muted">
              Precio
            </small>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Precio"
              min={0}
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: Number(e.target.value) })
              }
            />
            <small className="form-text text-muted mt-2">Estado: {formData.estado}</small>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
