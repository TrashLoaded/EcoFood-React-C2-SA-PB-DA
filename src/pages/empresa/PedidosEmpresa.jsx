import React, { useEffect, useState } from "react";
import {
  getPedidosPorEmpresa,
  aprobarPedido,
  rechazarPedido
} from "../../services/pedidoService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function PedidosEmpresa() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarPedidos = async () => {
    try {
      const data = await getPedidosPorEmpresa();
      setPedidos(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      Swal.fire("Error", "No se pudieron cargar los pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const manejarAprobacion = async (id) => {
    try {
      await aprobarPedido(id);
      Swal.fire("Aprobado", "Pedido aprobado correctamente", "success");
      cargarPedidos();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const manejarRechazo = async (id) => {
    try {
      await rechazarPedido(id);
      Swal.fire("Rechazado", "Pedido rechazado correctamente", "success");
      cargarPedidos();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h3>Pedidos Recibidos</h3>
        <div className="mb-3">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            ← Volver Atrás
          </button>
        </div>

        {loading && <p>Cargando pedidos...</p>}

        {!loading && pedidos.length === 0 && (
          <p>No hay pedidos por mostrar.</p>
        )}

        {!loading && pedidos.length > 0 && (
          <ul className="list-group">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{pedido.productoNombre}</strong><br />
                  Cantidad: {pedido.cantidadSolicitada}<br />
                  Cliente: {pedido.clienteNombre}<br />
                  Dirección: {pedido.clienteComuna}<br/>
                  Estado: <span className={`badge ${pedido.estado === "pendiente" ? "bg-warning text-dark" : pedido.estado === "aprobado" ? "bg-success" : "bg-danger"}`}>{pedido.estado}</span>
                  <p className="text-muted small">Fecha: {pedido.fecha}</p>
                </div>
                {pedido.estado === "pendiente" && (
                  <div className="btn-group">
                    <button className="btn btn-sm btn-success" onClick={() => manejarAprobacion(pedido.id)}>
                      Aprobar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => manejarRechazo(pedido.id)}>
                      Rechazar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
