import React, { useEffect, useState } from "react";
import { getMisPedidos, eliminarPedido } from "../../services/pedidoService";
import PedidoCard from "../../components/PedidoCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      const lista = await getMisPedidos();
      setPedidos(lista);
    };
    cargar();
  }, []);

  const handleEliminar = async (pedidoId) => {
    const res = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (res.isConfirmed) {
      try {
        await eliminarPedido(pedidoId);
        setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
        Swal.fire("Eliminado", "Pedido eliminado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el pedido", "error");
      }
    }
  };

  return (
    <div className="card container mt-4">
      <h3>Mis Pedidos</h3>
      <div className="row">
        {pedidos.map((p) => (
          <div key={p.id} className="col-md-6 mb-3">
            <PedidoCard pedido={p} onEliminar={handleEliminar} />
          </div>
        ))}
        <div className="mb-3 text-end">
          <button
            className="btn btn-success"
            onClick={() => navigate("/cliente/home")}
          >
            ← Volver al Home
          </button>
        </div>
      </div>
    </div>
  );
}
