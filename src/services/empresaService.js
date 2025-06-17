import { db } from "./firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

export const getEmpresaById = async (id) => {
  const empresaDoc = await getDoc(doc(db, "usuarios", id));
  return empresaDoc.exists() ? { id: empresaDoc.id, ...empresaDoc.data() } : null;
};

export const updateEmpresa = async (id, data) => {
  await updateDoc(doc(db, "usuarios", id), data);
};

export const getProductosByEmpresaId = async (empresaId) => {
  const productosRef = collection(db, "productos");
  const q = query(productosRef, where("empresaId", "==", empresaId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
