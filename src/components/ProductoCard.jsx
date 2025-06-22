import React from "react";

export default function ProductoCard({ producto, onSolicitar }) {
  const {
    nombre,
    empresaNombre,
    empresaComuna,
    cantidad,
    gratuito,
    precio
  } = producto;

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title fw-bold text-primary">{nombre}</h5>
          <p className="mb-1"><strong>🏢 Empresa:</strong> {empresaNombre || "No disponible"}</p>
          <p className="mb-1"><strong>📍 Ubicación:</strong> {empresaComuna || "No disponible"}</p>
          <p className="mb-1"><strong>📦 Stock:</strong> {cantidad}</p>
          <p className="mb-3">
            {gratuito ? (
              <span className="badge bg-success">Gratuito</span>
            ) : (
              <span className="text-muted">💲 Precio: ${precio}</span>
            )}
          </p>
        </div>

        <button
          className={`btn ${cantidad === 0 ? "btn-secondary" : "btn-success"} mt-auto w-100`}
          onClick={onSolicitar}
          disabled={cantidad === 0}
        >
          {cantidad === 0 ? "Sin stock" : "Solicitar"}
        </button>
      </div>
    </div>
  );
}
