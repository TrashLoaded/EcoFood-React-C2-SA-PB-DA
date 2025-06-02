import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const productosCollection = collection(db, "productos");

export const getProductosByEmpresa = async (empresaId) => {
  const q = query(productosCollection, where("empresaId", "==", empresaId));
  const querySnapshot = await getDocs(q);
  const productos = [];
  querySnapshot.forEach((doc) => {
    productos.push({ id: doc.id, ...doc.data() });
  });
  return productos;
};

export const crearProducto = (producto) => addDoc(productosCollection, producto);

export const actualizarProducto = (id, data) =>
  updateDoc(doc(db, "productos", id), data);

export const eliminarProducto = (id) => deleteDoc(doc(db, "productos", id));
