import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const db = getFirestore();

export async function eliminarPedido(pedidoId) {
  const pedidoRef = doc(db, "pedidos", pedidoId);
  await deleteDoc(pedidoRef);
}

export async function aprobarPedido(pedidoId) {
  const pedidoRef = doc(db, "pedidos", pedidoId);
  const pedidoSnap = await getDoc(pedidoRef);
  if (!pedidoSnap.exists()) throw new Error("Pedido no encontrado.");

  const pedido = pedidoSnap.data();
  if (pedido.estado !== "pendiente") {
    throw new Error("Este pedido ya fue gestionado.");
  }

  const productoRef = doc(db, "productos", pedido.productoId);
  const productoSnap = await getDoc(productoRef);
  if (!productoSnap.exists()) throw new Error("Producto no encontrado.");

  const producto = productoSnap.data();

  if ((producto.cantidad || 0) < pedido.cantidadSolicitada) {
    throw new Error("Stock insuficiente.");
  }

  const nuevaCantidad = (producto.cantidad || 0) - pedido.cantidadSolicitada;

  await updateDoc(pedidoRef, { estado: "aprobado" });

  if (nuevaCantidad === 0) {
    await updateDoc(productoRef, {
      cantidad: nuevaCantidad,
      visible: false
    });
  } else {
    await updateDoc(productoRef, {
      cantidad: nuevaCantidad
    });
  }
}


export async function rechazarPedido(pedidoId) {
  const pedidoRef = doc(db, "pedidos", pedidoId);
  const pedidoSnap = await getDoc(pedidoRef);
  if (!pedidoSnap.exists()) throw new Error("Pedido no encontrado.");

  const pedido = pedidoSnap.data();
  if (pedido.estado !== "pendiente") {
    throw new Error("Este pedido ya fue gestionado.");
  }

  await updateDoc(pedidoRef, { estado: "rechazado" });
}


export async function getProductosDisponibles() {
  const productosSnap = await getDocs(collection(db, "productos"));
  const productosData = productosSnap.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter(p => p.visible !== false);

  const productosEnriquecidos = await Promise.all(
    productosData.map(async (producto) => {
      if (!producto.empresaId) {
        return {
          ...producto,
          empresaNombre: "Sin empresa",
          empresaComuna: "No disponible"
        };
      }

      const empresaRef = doc(db, "usuarios", producto.empresaId);
      const empresaSnap = await getDoc(empresaRef);

      if (empresaSnap.exists()) {
        const empresaData = empresaSnap.data();
        return {
          ...producto,
          empresaNombre: empresaData.nombre || "Sin nombre",
          empresaComuna: empresaData.comuna || "Sin ubicación"
        };
      } else {
        return {
          ...producto,
          empresaNombre: "Empresa no encontrada",
          empresaComuna: "No disponible"
        };
      }
    })
  );

  return productosEnriquecidos;
}

export async function solicitarProducto(producto, cantidad) {
  const auth = getAuth();
  const uid = auth.currentUser.uid;

  const productoRef = doc(getFirestore(), "productos", producto.id);
  const productoSnap = await getDoc(productoRef);

  if (!productoSnap.exists()) {
    throw new Error("Producto no encontrado.");
  }

  const productoData = productoSnap.data();

  if (!productoData.visible === false || productoData.cantidad === 0) {
    throw new Error("Este producto no está disponible para solicitar.");
  }

  const usuarioRef = doc(db, "usuarios", uid);
  const usuarioSnap = await getDoc(usuarioRef);

  let clienteNombre = "Nombre no disponible";
  if (usuarioSnap.exists()) {
    const usuarioData = usuarioSnap.data();
    clienteNombre = usuarioData.nombre || clienteNombre;
  }

  let clienteComuna = "Nombre no disponible";
  if (usuarioSnap.exists()) {
    const usuarioData = usuarioSnap.data();
    clienteComuna = usuarioData.comuna || clienteComuna;
  }

  const pedidosRef = collection(getFirestore(), "pedidos");
  const q = query(
    pedidosRef,
    where("clienteId", "==", uid),
    where("productoId", "==", producto.id),
    where("estado", "==", "pendiente")
  );

  const pedidosSnap = await getDocs(q);
  if (!pedidosSnap.empty) {
    throw new Error("Ya hiciste un pedido pendiente para este producto.");
  }

  const pedido = {
    clienteId: uid,
    clienteNombre,
    clienteComuna,
    productoId: producto.id,
    empresaId: producto.empresaId,
    cantidadSolicitada: cantidad,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "pendiente",
    productoNombre: producto.nombre,
    empresaNombre: producto.empresaNombre
  };

  await addDoc(pedidosRef, pedido);
}



export async function getMisPedidos() {
  const uid = getAuth().currentUser.uid;
  const q = query(collection(db, "pedidos"), where("clienteId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }));
}

export async function getPedidosPorEmpresa() {
  const uid = getAuth().currentUser.uid;
  const q = query(collection(db, "pedidos"), where("empresaId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
