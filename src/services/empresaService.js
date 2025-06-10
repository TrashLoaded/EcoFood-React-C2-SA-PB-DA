import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getEmpresaById = async (id) => {
  const empresaDoc = await getDoc(doc(db, "usuarios", id));
  return empresaDoc.exists() ? { id: empresaDoc.id, ...empresaDoc.data() } : null;
};

export const updateEmpresa = async (id, data) => {
  await updateDoc(doc(db, "usuarios", id), data);
};