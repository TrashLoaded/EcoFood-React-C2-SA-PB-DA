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
import { useLocation, useNavigate } from "react-router-dom";



export default function ProductosEmpresa() {
  const location = useLocation();
  const empresaId = location.state?.empresaId || null;
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  const [orden, setOrden] = useState("nombreAsc");
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);

  const navigate = useNavigate();
  
  const cargarProductos = async () => {
    try {
      const data = await getProductosByEmpresa(empresaId);
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    if (empresaId) {
      cargarProductos();
    }
  }, [empresaId]);

  const filtrarProductos = () => {
    const hoy = new Date();
    let resultado = productos;

    if (filtro === "activos") {
      resultado = resultado.filter((p) => p.estado === "disponible");
    } else if (filtro === "porVencer") {
      resultado = resultado.filter((p) => {
        const diffDias = (new Date(p.vencimiento) - hoy) / (1000 * 60 * 60 * 24);
        return diffDias >= 0 && diffDias <= 3;
      });
    } else if (filtro === "gratuitos") {
      resultado = resultado.filter((p) => p.precio === 0);
    } else if (filtro === "conValor") {
      resultado = resultado.filter((p) => p.precio > 0);
    }

    if (orden === "nombreAsc") {
      resultado = resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "nombreDesc") {
      resultado = resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (orden === "precioAsc") {
      resultado = resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precioDesc") {
      resultado = resultado.sort((a, b) => b.precio - a.precio);
    }

    return resultado;
  };

  const productosFiltrados = filtrarProductos();
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const guardarProducto = async (producto) => {
    try {
      if (producto.id) {
        await actualizarProducto(producto.id, producto);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        console.log("Creando producto:", producto);
        await crearProducto({ ...producto, empresaId });
        Swal.fire("Creado", "Producto creado correctamente", "success");
      }
      setShowModal(false);
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      Swal.fire("Error", `No se pudo guardar el producto: ${error.message}`, "error");
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
      try {
        await eliminarProducto(id);
        Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
        cargarProductos();
      } catch (error) {
        console.error("Error eliminando producto:", error);
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  return (
    <div className="container mt-4 position-relative">
      <div className="card p-4 shadow">
        <h3>Gestión de Productos</h3>

        <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <select
            className="form-select w-auto"
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="porVencer">Por Vencer (3 días)</option>
            <option value="gratuitos">Gratuitos</option>
            <option value="conValor">Con Valor</option>
          </select>

          <select
            className="form-select w-auto"
            value={orden}
            onChange={(e) => {
              setOrden(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="nombreAsc">Nombre A-Z</option>
            <option value="nombreDesc">Nombre Z-A</option>
            <option value="precioAsc">Precio Ascendente</option>
            <option value="precioDesc">Precio Descendente</option>
          </select>

          <select
            className="form-select w-auto"
            value={itemsPorPagina}
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value));
              setPaginaActual(1);
            }}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
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
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/empresa/perfil")}
          >
            Volver al Perfil
          </button>
        </div>

        {productosPaginados.length === 0 && (
          <p className="text-center text-muted">No hay productos para mostrar.</p>
        )}

        {productosPaginados.map((producto) => (
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

        {totalPaginas > 1 && (
          <nav aria-label="Paginación productos" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>
              </li>
              {[...Array(totalPaginas)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  paginaActual === totalPaginas ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <ProductoModal
            productoEditar={productoEditar}
            onGuardar={guardarProducto}
            onCerrar={() => setShowModal(false)}
          />
        </div>
        
      )}
          <button
            className="btn btn-outline-info m-2"
            onClick={() => navigate("/empresa/pedidos")}
          >
            Ver Pedidos Recibidos
          </button>
    </div>
  );
}
