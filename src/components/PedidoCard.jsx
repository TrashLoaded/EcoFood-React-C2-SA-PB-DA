import React from "react";

export default function PedidoCard({ pedido, onEliminar }) {
  return (
    <div className="card p-3 h-100">
      <h5 className="fw-bold">{pedido.productoNombre}</h5>
      <p className="mb-1">Empresa: {pedido.empresaNombre}</p>
      <p className="mb-1">Cantidad: {pedido.cantidadSolicitada}</p>
      <p className="mb-1">
        Estado: <span className="badge bg-info text-dark">{pedido.estado}</span>
      </p>
      <p className="text-muted small">Fecha: {pedido.fecha}</p>

      {pedido.estado === "rechazado" && (
        <button
          className="btn btn-sm btn-outline-danger mt-2"
          onClick={() => onEliminar(pedido.id)}
        >
          🗑 Eliminar Pedido
        </button>
      )}
    </div>
  );
}
