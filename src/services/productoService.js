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
  try {
    const q = query(productosCollection, where("empresaId", "==", empresaId));
    const querySnapshot = await getDocs(q);
    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });
    return productos;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    throw error;
  }
};

export const crearProducto = async (producto) => {
  try {
    const docRef = await addDoc(productosCollection, producto);
    return docRef;
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
};

export const actualizarProducto = async (id, data) => {
  try {
    const docRef = doc(db, "productos", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const docRef = doc(db, "productos", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
  }
};
