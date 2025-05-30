import {
  collection, query, where, getDocs, addDoc,
  updateDoc, deleteDoc, doc, setDoc
} from "firebase/firestore";
import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


export async function getUsuariosPorTipo(tipo) {
  const ref = collection(db, "usuarios");
  const q = query(ref, where("tipo", "==", tipo));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export const getClientes = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const registrarClienteConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      tipo: "cliente",
      email: datos.email || ""
    });
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando cliente:", error);
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, clienteData);
};

export const deleteCliente = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};