import React from "react";

export default function ProductoCard({ producto, onEditar, onEliminar }) {
  const hoy = new Date();
  const vencimiento = new Date(producto.vencimiento);
  const diasParaVencer = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <p className="card-text">
          <small className="text-muted">
            Vence el: {producto.vencimiento}{" "}
            {diasParaVencer <= 3 && diasParaVencer >= 0 && (
              <span className="badge bg-warning text-dark ms-2">
                Por vencer en {diasParaVencer} día{diasParaVencer > 1 ? "s" : ""}
              </span>
            )}
            {diasParaVencer < 0 && (
              <span className="badge bg-danger ms-2">Vencido</span>
            )}
          </small>
        </p>
        <p className="card-text">
          Cantidad: {producto.cantidad} | Precio:{" "}
          {producto.precio === 0 ? (
            <span className="badge bg-success">Gratis</span>
          ) : (
            `$${producto.precio}`
          )}{" "}
          | Estado: {producto.estado}
        </p>
        <button
          className="btn btn-warning btn-sm me-2"
          onClick={() => onEditar(producto)}
        >
          Editar
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onEliminar(producto.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
