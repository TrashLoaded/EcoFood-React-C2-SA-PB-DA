import React, { useEffect, useState } from "react";
import {
  getProductosByEmpresa,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../services/productoService";
import ProductoCard from "../../components/ProductCard";
import ProductoModal from "../../components/ProductoModal";
import Swal from "sweetalert2";

export default function ProductosEmpresa({ empresaId }) {
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const cargarProductos = async () => {
    const data = await getProductosByEmpresa(empresaId);
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, [empresaId]);

  const filtrarProductos = () => {
    const hoy = new Date();
    if (filtro === "todos") return productos;

    if (filtro === "activos") {
      return productos.filter((p) => p.estado === "disponible");
    }

    if (filtro === "porVencer") {
      return productos.filter((p) => {
        const diffDias = (new Date(p.vencimiento) - hoy) / (1000 * 60 * 60 * 24);
        return diffDias >= 0 && diffDias <= 3;
      });
    }

    if (filtro === "gratuitos") {
      return productos.filter((p) => p.precio === 0);
    }

    if (filtro === "conValor") {
      return productos.filter((p) => p.precio > 0);
    }

    return productos;
  };

  const guardarProducto = async (producto) => {
    try {
      if (producto.id) {
        await actualizarProducto(producto.id, producto);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        await crearProducto({ ...producto, empresaId });
        Swal.fire("Creado", "Producto creado correctamente", "success");
      }
      setShowModal(false);
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  const eliminar = async (id) => {
    const res = await Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (res.isConfirmed) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h3>Gestión de Productos</h3>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <select
            className="form-select w-auto"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="porVencer">Por Vencer (3 días)</option>
            <option value="gratuitos">Gratuitos</option>
            <option value="conValor">Con Valor</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              setProductoEditar(null);
              setShowModal(true);
            }}
          >
            Nuevo Producto
          </button>
        </div>

        {filtrarProductos().length === 0 && (
          <p className="text-center text-muted">No hay productos para mostrar.</p>
        )}

        {filtrarProductos().map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onEditar={(p) => {
              setProductoEditar(p);
              setShowModal(true);
            }}
            onEliminar={eliminar}
          />
        ))}

        {showModal && (
          <ProductoModal
            productoEditar={productoEditar}
            onGuardar={guardarProducto}
            onCerrar={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
