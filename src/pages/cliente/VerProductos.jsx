import React, { useEffect, useState } from "react";
import { getProductosDisponibles, solicitarProducto } from "../../services/pedidoService";
import ProductoCard from "../../components/ProductoCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function VerProductos() {
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      const lista = await getProductosDisponibles();
      setProductos(lista);
    };
    cargar();
  }, []);

  const handleSolicitud = async (producto) => {
    if (producto.cantidad === 0) {
      Swal.fire("Sin stock", "El producto ya no tiene stock disponible.", "info");
      return;
    }

    const { value: cantidad } = await Swal.fire({
      title: `Solicitar ${producto.nombre}`,
      text: `Stock disponible: ${producto.cantidad}`,
      input: "number",
      inputAttributes: {
        min: 1,
        max: producto.cantidad,
        step: 1
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Solicitar"
    });

    if (cantidad) {
      if (cantidad > producto.cantidad || cantidad <= 0) {
        Swal.fire("Error", "Cantidad inválida", "error");
        return;
      }

      try {
        await solicitarProducto(producto, parseInt(cantidad));
        Swal.fire("Éxito", "Solicitud enviada correctamente", "success");

        setProductos(prev =>
          prev.map(p =>
            p.id === producto.id
              ? { ...p, cantidad: p.cantidad - parseInt(cantidad) }
              : p
          )
        );
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const productosFiltrados = productos
    .filter(p =>
      p.nombre.toLowerCase().includes(filtroTexto.toLowerCase())
    );

  return (
    <div className="container mt-4">        
      <div className="card text-center mb-4 shadow-sm">
        <h2 className="card-title mt-3">🛒 Productos Disponibles</h2>
        <p className="text-muted mb-3">Busca y solicita productos fácilmente</p>
      </div>
      
      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-light border-0">🔍</span>
        <input
          type="text"
          className="form-control border-0"
          placeholder="Buscar producto por nombre..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
        />
      </div>
      <div className="mb-3 text-end">
        <button
          className="btn btn-success"
          onClick={() => navigate("/cliente/home")}
        >
          ← Volver al Home
        </button>
      </div>

      <div className="row">
        {productosFiltrados.length === 0 ? (
          <div className="col-12 text-center text-muted fs-5 mt-4">
            No se encontraron productos.
          </div>
        ) : (
          productosFiltrados.map((prod) => (
            <div key={prod.id} className="mb-4">
              <ProductoCard producto={prod} onSolicitar={() => handleSolicitud(prod)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
